const { GoogleGenAI } = require("@google/genai");
const { z } = require("zod");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

// Zod Validation Schema
const interviewReportSchema = z.object({
    matchScore: z.number()
        .min(1)
        .max(100),

    technicalQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        }).strict()
    ),

    behavioralQuestions: z.array(
        z.object({
            question: z.string(),
            intention: z.string(),
            answer: z.string()
        }).strict()
    ),

    skillGaps: z.array(
        z.object({
            skill: z.string(),
            severity: z.enum([
                "low",
                "medium",
                "high"
            ])
        }).strict()
    ),

    preparationPlan: z.array(
        z.object({
            day: z.number(),
            focus: z.string(),
            tasks: z.array(
                z.string()
            )
        }).strict()
    ),
    title: z.string()
}).strict();


// Generate Interview Report
async function generateInterviewReport({ resume, selfDescription, jobDescription }) {
    try {
        const prompt = `
            Return ONLY valid JSON.

            DO NOT RETURN MARKDOWN.
            DO NOT RETURN EXPLANATION.
            DO NOT RETURN ARRAY VALUES AS STRINGS.

            IMPORTANT:
            Arrays MUST contain OBJECTS.

            Correct Example:

            {
            "title": "Software Engineer Interview Report",

            "matchScore": 90,

            "technicalQuestions": [
                {
                "question": "What is React?",
                "intention": "Check React knowledge",
                "answer": "Explain component architecture."
                }
            ],

            "behavioralQuestions": [
                {
                "question": "Tell me about yourself",
                "intention": "Check communication skills",
                "answer": "Give concise professional introduction."
                }
            ],

            "skillGaps": [
                {
                "skill": "Testing",
                "severity": "medium"
                }
            ],

            "preparationPlan": [
                {
                "day": 1,
                "focus": "React Revision",
                "tasks": [
                    "Practice hooks",
                    "Build mini project"
                ]
                }
            ]
            }

            Generate:
            - 3 technical questions - gives a answer of technical question in minimun 2 or 3 line
            - 3 behavioral questions - gives a answer of behavioral question in minimun 2 or 2.5 line
            - 4 to 5 skill gaps
            - 7 preparation plan days
            - Keep answers concise
            - Tasks should be short

            Candidate Resume:
            ${resume}

            Candidate Self Description:
            ${selfDescription}

            Job Description:
            ${jobDescription}
        `;

        const response = await ai.models.generateContent({
            // model: "gemini-2.5-flash",
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json"
            }
        });
        // console.log("RAW AI RESPONSE: \n\n" + response.text);  // DEBUGING RAW RESPONSE

        const parsedData = JSON.parse(response.text);   // Parse JSON - response.text is a string, we need to parse it to get the JSON object

        const validatedData = interviewReportSchema.parse(parsedData); // Validate Using Zod

        // console.log(
        //     "VALIDATED INTERVIEW REPORT: \n\n",
        //     JSON.stringify(
        //         validatedData,
        //         null,
        //         2
        // )); // DEBUGING VALIDATED DATA

        return validatedData;

    } catch (error) {
        console.error("Error durring generating interview report: \n", error);

        throw new Error(
            "Failed to generate interview report"
        );
    }
}

/**
 * @description Generate Resume PDF from HTML content
 */
async function generatePdfFromHtml(htmlContent) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
        format: "A4", margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm"
        }
    });

    await browser.close();
    return pdfBuffer;
}

/**
 * @description Generate resume based on Job Description
 */
async function generateResumePdf({ resume, selfDescription, jobDescription }) {

    const resumePdfSchema = z.object({
        html: z.string().describe("The HTML content of the resume which can be converted to PDF using any library like puppeteer")
    });

    const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                `

    const response = await ai.models.generateContent({
        // model : "gemini-2.5-flash",
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            // responseSchema: zodToJsonSchema(resumePdfSchema)
        }
    });

    const jsonContent = JSON.parse(response.text);

    const pdfBuffer = await generatePdfFromHtml(jsonContent.html);
    return pdfBuffer;
}

module.exports = { generateInterviewReport, generateResumePdf };
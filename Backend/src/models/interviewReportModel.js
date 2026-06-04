// const mongoose = require("mongoose");

// const technicalQueShema = new mongoose.Schema({
//     question : {
//         type : String,
//         required : [true, "Technical question is required"]
//     },
//     intention : {
//         type : String,
//         required : [true, "Intention is required"]
//     },
//     answer : {
//         type : String,
//         required : [true, "Answer is required"]
//     },
// },{_id : false });

// const behavioralQueShema = new mongoose.Schema({
//     question : {
//         type : String,
//         required : [true, "Technical question is required"]
//     },
//     intention : {
//         type : String,
//         required : [true, "Intention is required"]
//     },
//     answer : {
//         type : String,
//         required : [true, "Answer is required"]
//     },
// },{ _id : false});

// const skillGapsSchema = new mongoose.Schema({
//     skill : {
//         type : String,
//         required : [true, "Skill is required"]
//     },
//     severity : {
//         type : String,
//         enum : ["low", "medium", "high"],
//         required : [true, "Severity is required"]
//     }
// }, { _id : false });

// const preparationPlanSchema = new mongoose.Schema({
//     day : {
//         type : Number,
//         required : [true, "Day is required"]
//     },
//     focus : {
//         type : String,
//         required : [true, "Focus is required"]
//     },
//     tasks : [{
//         type : String,
//         required : [true, "Task is required" ]
//     }]
// });


// const interviewReportSchema = new mongoose.Schema({
//     jobDescription : {
//         type : String,
//         required : [true, "Job Description is required"]
//     },
//     resumetext : {
//         type : String,
//         required : true
//     },
//     selfDescription : {
//         type : String,
//         required : true
//     },
//     matchScore : {
//         type : Number,
//         min : 1,
//         max : 100
//     },
//     technicalQuestion : [technicalQueShema],
//     behavioralQuestion : [behavioralQueShema],
//     skillGaps : [skillGapsSchema],
//     preparationPlan : [preparationPlanSchema]
// }, {timestamps : true});

// const interviewReport = new mongoose.model("interviewReport", interviewReportSchema);
// module.exports = interviewReport;

const mongoose = require("mongoose");

const technicalQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    intention: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { _id: false });

const behavioralQuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    intention: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    }
}, { _id: false });

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,
        required: true
    },
    severity: {
        type: String,
        enum: ["low", "medium", "high"],
        required: true
    }
}, { _id: false });

const preparationPlanSchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    focus: {
        type: String,
        required: true
    },
    tasks: [{
        type: String,
        required: true
    }]
}, { _id: false });

const interviewReportSchema = new mongoose.Schema({
    jobDescription: {
        type: String,
        required: true
    },

    resume: {           // resumeText
        type: String,
        required: true
    },

    selfDescription: {
        type: String,
        required: true
    },
    matchScore: {
        type: Number,
        min: 1,
        max: 100
    },
    technicalQuestions: [technicalQuestionSchema],
    behavioralQuestions: [behavioralQuestionSchema],
    skillGaps: [skillGapSchema],
    preparationPlan: [preparationPlanSchema],
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "users"
    },
    title : {
        type : String,
        required : [true, "Job Title is required"]
    }

}, { timestamps: true });

module.exports = mongoose.model(
    "InterviewReport",
    interviewReportSchema
);
// import { RouterProvider} from "react-router";
import { RouterProvider} from "react-router-dom";
import {router} from "./AppRoutes.jsx"
import { AuthProvider } from "./features/auth/AuthContext.jsx"
import { InterviewProvider } from "./features/interview/InterviewContext.jsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function App() {
  
  return (
    <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router}/>
          <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    theme="dark"
          />
        </InterviewProvider>
    </AuthProvider>
  )
}

export default App

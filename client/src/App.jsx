import SignIn from './components/Auth/signin';
import SignUp from './components/Auth/signup';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./index.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function App() {
  return (
    <>
    <ToastContainer />
    <Router>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
    </>
  );
}
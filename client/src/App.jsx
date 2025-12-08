import SignIn from './components/Auth/signin';
import SignUp from './components/Auth/signup';
import Home from './components/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./index.css";
import "./App.css"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Message from './components/message';
import NotFound from './NotFoundPage';
import { GoogleOAuthProvider } from '@react-oauth/google';

export default function App() {
  return (
    <>
      <ToastContainer />

      <GoogleOAuthProvider clientId={import.meta.env.VITE_APP_API_GOOGLE_CLIENT_ID}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/u/:token" element={<Message />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </>
  );
}

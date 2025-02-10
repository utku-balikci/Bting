import { useState } from "react";
import { auth, googleProvider, signInWithPopup, signInWithEmailAndPassword } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css"; 

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      googleProvider.setCustomParameters({
        prompt: "select_account" 
      });

      await signInWithPopup(auth, googleProvider);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Google Login failed:", error.message);
    }
  };

  const handleEmailLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      navigate("/dashboard");
    } catch (error) {
      console.error("Email Login failed:", error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <div className="input-group">
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button onClick={handleEmailLogin}>Sign in with Email</button>
      </div>
      <button onClick={handleGoogleLogin} className="google-button">Sign in with Google</button>
    </div>
  );
};

export default Login;
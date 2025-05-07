import { useState, useEffect } from "react";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail 
} from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState(localStorage.getItem("savedEmail") || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [showResetPrompt, setShowResetPrompt] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (email) localStorage.setItem("savedEmail", email);
  }, [email]);

  const handleGoogleLogin = async () => {
    try {
      googleProvider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, googleProvider);
      setIsAuthenticated(true);
      localStorage.setItem("savedEmail", result.user.email);
      navigate("/");
    } catch (error) {
      setErrorMessage("Google Login failed. Please try again.");
      console.error("Google Login failed:", error.message);
    }
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      setLoginAttempts(prev => prev + 1);
      setErrorMessage("Invalid email or password. Try again.");

      if (loginAttempts + 1 >= 3) {
        setShowResetPrompt(true);
      }

      console.error("Email Login failed:", error.message);
    }
  };

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setIsAuthenticated(true);
      navigate("/");
    } catch (error) {
      setErrorMessage("Signup failed. Try again.");
      console.error("Signup failed:", error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      setErrorMessage("Enter your email to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("A password reset email has been sent to your inbox.");
    } catch (error) {
      setErrorMessage("Failed to send reset email.");
      console.error("Reset failed:", error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">{isSignup ? "Sign Up" : "Login"}</h2>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

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

        {isSignup && (
          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
        )}

        {isSignup ? (
          <button onClick={handleSignup} className="login-button">
            Sign Up
          </button>
        ) : (
          <button onClick={handleEmailLogin} className="login-button">
            Sign in with Email
          </button>
        )}

        {!isSignup && (
          <p className="forgot-password" onClick={handlePasswordReset}>
            Forgot Password?
          </p>
        )}
      </div>

      {showResetPrompt && (
        <div className="reset-popup">
          <p>Too many failed attempts. Would you like to reset your password?</p>
          <button onClick={handlePasswordReset}>Send Reset Email</button>
        </div>
      )}

      <button onClick={handleGoogleLogin} className="google-button">
        Sign in with Google
      </button>

      <p className="switch-mode">
        {isSignup ? "Already have an account?" : "Don't have an account?"}
        <span onClick={() => setIsSignup(!isSignup)} className="toggle-link">
          {isSignup ? " Log in" : " Sign up"}
        </span>
      </p>
    </div>
  );
};

export default Login;
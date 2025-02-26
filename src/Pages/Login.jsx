import { useState, useEffect } from "react";
import { 
  auth, 
  googleProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword 
} from "../firebaseConfig";
import { useNavigate } from "react-router-dom";
import "../Styles/Login.css";

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState(localStorage.getItem("savedEmail") || ""); // Load email from localStorage
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // Save email to localStorage when it changes
  useEffect(() => {
    if (email) {
      localStorage.setItem("savedEmail", email);
    }
  }, [email]);

  // Google Login
  const handleGoogleLogin = async () => {
    try {
      googleProvider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(auth, googleProvider);
      setIsAuthenticated(true);
      localStorage.setItem("savedEmail", result.user.email); // Save Google account email
      navigate("/"); 
    } catch (error) {
      setErrorMessage("Google Login failed. Please try again.");
      console.error("Google Login failed:", error.message);
    }
  };

  // Email Login
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
      setErrorMessage("Invalid email or password. Try again.");
      console.error("Email Login failed:", error.message);
    }
  };

  // Signup with Email
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
      </div>

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
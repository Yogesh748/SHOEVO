import React, { useState, useContext } from 'react';
import { IoClose } from "react-icons/io5";
import { CartContext } from '../context/CartContext';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Make sure useNavigate is imported

const LoginPopup = () => {
  const { setShowLogin, setToken } = useContext(CartContext);
  const [currentState, setCurrentState] = useState("Login");
  const navigate = useNavigate(); // Initialize navigate

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  // Handles changes in text inputs, textarea, and selects
  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  // Handles form submission for Login, Signup, and Password Reset
  const handleAuth = async (event) => {
    event.preventDefault();
    let userToken = null; // Variable to hold the token

    // --- Password Reset Logic ---
    if (currentState === "Reset Password") {
      try {
        await sendPasswordResetEmail(auth, data.email);
        alert("Password reset link sent to your email!");
        setCurrentState("Login"); // Go back to login screen
      } catch (error) {
        alert(`Password Reset Error: ${error.message}`);
      }
      return; // Stop execution for password reset
    }

    // --- Login / Signup Logic ---
    try {
      let response;
      // --- Signup ---
      if (currentState === "Sign Up") {
         response = await createUserWithEmailAndPassword(auth, data.email, data.password);
         if (response.user) {
           await sendEmailVerification(response.user);
           alert("Account created! Verification link sent to email.");
           userToken = await response.user.getIdToken(); // Get token

           // Call backend to register user in MongoDB
           if (userToken) {
             try {
                 await axios.post('http://localhost:4000/api/user/register',
                   { name: data.name, email: data.email },
                   { headers: { Authorization: `Bearer ${userToken}` } }
                 );
                 // No need to wait for response unless handling specific DB errors here
             } catch (dbError) {
                 console.error("Error registering user in DB after signup:", dbError);
                 // Inform user but don't block login flow entirely unless critical
                 alert("Account created in Firebase, but failed to save details to our database. Please contact support if issues persist.");
             }
           }
           setShowLogin(false); // Close popup after signup process completes or fails DB save
         }
      }
      // --- Login ---
      else { // currentState === "Login"
        response = await signInWithEmailAndPassword(auth, data.email, data.password);
        if (response.user) {
          userToken = await response.user.getIdToken();
          setToken(userToken); // Set token in context first
          localStorage.setItem("token", userToken); // Save token

          // Check role immediately after login
          if (userToken) {
              try {
                  // Call backend to get user's role
                  const roleResponse = await axios.get('http://localhost:4000/api/user/getrole', {
                      headers: { Authorization: `Bearer ${userToken}` }
                  });

                  if (roleResponse.data.success) {
                      setShowLogin(false); // Close popup
                      if (roleResponse.data.role === 'admin') {
                          navigate("/admin"); // Redirect admin to base admin route
                      } else {
                          navigate("/"); // Redirect customer to homepage
                      }
                  } else {
                      // Couldn't get role from backend (e.g., user not in DB)
                      alert("Login successful but could not verify user role. Logging out.");
                      localStorage.removeItem("token");
                      setToken(null);
                      setShowLogin(false);
                      navigate("/");
                  }
              } catch (roleError) {
                  // Error calling the getrole API
                  console.error("Error fetching user role after login:", roleError);
                  alert("Login successful but failed to fetch user role. Logging out.");
                  localStorage.removeItem("token");
                  setToken(null);
                  setShowLogin(false);
                  navigate("/");
              }
          } else {
             // Fallback if token somehow fails after login (highly unlikely)
             setShowLogin(false);
             navigate("/");
          }
        }
      }
    } catch (error) {
        // Catch Firebase errors (wrong password, user not found, email exists etc.)
        alert(`Authentication Error: ${error.message}`);
    }
  };

  // --- JSX for the form ---
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"> {/* Added backdrop-blur */}
      <form onSubmit={handleAuth} className="relative bg-white p-6 rounded-lg w-[90%] max-w-md flex flex-col gap-5 animate-fadeIn shadow-xl"> {/* Added shadow */}
        {/* Header with Title and Close Button */}
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-gray-800">{currentState}</h2>
          <IoClose onClick={() => setShowLogin(false)} className="w-6 h-6 cursor-pointer text-gray-500 hover:text-gray-800" />
        </div>

        {/* Input Fields */}
        <div className="flex flex-col gap-4">
          {currentState === "Sign Up" && (
            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder="Your name" required className="outline-none border border-gray-300 p-2 rounded-md focus:border-black"/>
          )}

          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder="Your email" required className="outline-none border border-gray-300 p-2 rounded-md focus:border-black"/>

          {currentState !== "Reset Password" && (
             <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder="Password" required className="outline-none border border-gray-300 p-2 rounded-md focus:border-black"/>
          )}
        </div>

        {/* Submit Button */}
        <button type="submit" className="bg-black text-white p-2.5 rounded-md hover:bg-gray-800 transition-colors">
          {currentState === "Sign Up" ? "Create account" : currentState === "Login" ? "Login" : "Send Reset Link"}
        </button>

        {/* Forgot Password Link */}
        {currentState === "Login" && (
            <p onClick={() => setCurrentState("Reset Password")} className="text-sm text-right cursor-pointer text-blue-600 hover:underline -mt-3">Forgot password?</p>
        )}

        {/* Agreement Checkbox */}
        {currentState !== "Reset Password" && (
          <div className="flex items-start gap-2 text-sm mt-2 text-gray-600">
            <input type="checkbox" required id="terms" className="mt-1 accent-black"/>
            <label htmlFor='terms'>By continuing, I agree to the terms of use & privacy policy.</label>
          </div>
        )}

        {/* Switch between Login/Signup/Reset */}
        {currentState === "Login" ? (
          <p className="text-sm text-center text-gray-600 mt-2">Create a new account? <span onClick={() => setCurrentState("Sign Up")} className="text-blue-600 font-semibold cursor-pointer hover:underline">Click here</span></p>
        ) : currentState === "Sign Up" ? (
          <p className="text-sm text-center text-gray-600 mt-2">Already have an account? <span onClick={() => setCurrentState("Login")} className="text-blue-600 font-semibold cursor-pointer hover:underline">Login here</span></p>
        ) : ( // currentState === "Reset Password"
          <p className="text-sm text-center text-gray-600 mt-2">Back to <span onClick={() => setCurrentState("Login")} className="text-blue-600 font-semibold cursor-pointer hover:underline">Login</span></p>
        )}
      </form>
    </div>
  );
};

export default LoginPopup;
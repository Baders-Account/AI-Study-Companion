// pages/auth/LoginSignup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config.js";
import { useAuth } from "../../contexts/AuthContext";

function LoginSignup() {
  // Login state
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Signup state
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupRole, setSignupRole] = useState("student"); // student or instructor
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // Use login function from context

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const username = loginUsername.trim();
    const password = loginPassword;

    if (!username || !password) {
      setLoginError("Please enter both username and password.");
      setLoginLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Use context login function to update global state and localStorage
        login(data.user);

        // Navigate based on role
        const role = data.user.role;
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "instructor") {
          navigate("/instructor");
        } else {
          navigate("/Dashboard");
        }
      } else {
        setLoginError(data.error || "Login failed. Please check your credentials.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError("Network error. Please check your connection and try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");
    setSignupLoading(true);

    // Validation
    if (!signupUsername || !signupEmail || !signupPassword || !signupConfirmPassword || !signupFirstName || !signupLastName) {
      setSignupError("Please fill in all fields.");
      setSignupLoading(false);
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match.");
      setSignupLoading(false);
      return;
    }

    if (signupPassword.length < 6) {
      setSignupError("Password must be at least 6 characters.");
      setSignupLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: signupUsername.trim(),
          email: signupEmail.trim(),
          password: signupPassword,
          firstName: signupFirstName.trim(),
          lastName: signupLastName.trim(),
          role: signupRole,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSignupSuccess("Account created successfully! You can now log in.");
        // Clear form
        setSignupUsername("");
        setSignupEmail("");
        setSignupPassword("");
        setSignupConfirmPassword("");
        setSignupFirstName("");
        setSignupLastName("");
        setSignupRole("student");
      } else {
        setSignupError(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setSignupError("Network error. Please check your connection and try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "#B0B1B4" }}>
      <header className="w-full max-w-4xl mb-8 px-4">
        <h1 className="text-center text-3xl font-bold py-4 rounded-lg" style={{ backgroundColor: "#676C80", color: "#FFFFFF" }}>
          Login / Signup
        </h1>
      </header>

      <div className="w-full max-w-4xl p-6 rounded-lg" style={{ backgroundColor: "#2D2F36" }}>
        <div className="flex items-center justify-center mb-6">
          <div className="mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: "#000000" }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="px-8 py-3 rounded-full" style={{ backgroundColor: "#676C80" }}>
            <h2 className="text-xl font-semibold" style={{ color: "#FFFFFF" }}>
              Welcome to Study Companion
            </h2>
          </div>
        </div>


        <div className="flex flex-col md:flex-row gap-6 justify-center">
          {/* LOGIN */}
          <div className="flex-1 p-6 rounded-lg" style={{ backgroundColor: "#393F56" }}>
            <h3 className="text-center text-xl font-semibold mb-6" style={{ color: "#FFFFFF" }}>
              Login
            </h3>
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter Username"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
                disabled={loginLoading}
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
                disabled={loginLoading}
              />
              {loginError && <p className="text-red-300 text-sm text-center">{loginError}</p>}
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-full font-semibold mt-2 disabled:opacity-50"
                style={{ backgroundColor: "#676C80", color: "#FFFFFF" }}
                disabled={loginLoading}
              >
                {loginLoading ? "Logging in..." : "Log In"}
              </button>

              {/* Quick Login Buttons */}
              <div className="mt-4 pt-4 border-t border-gray-600">
                <p className="text-xs text-gray-400 text-center mb-3">Quick Login (Dev Only)</p>
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername("student");
                      setLoginPassword("student123");
                      setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                    }}
                    className="w-full px-3 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#4A90A4", color: "#FFFFFF" }}
                    disabled={loginLoading}
                  >
                    🎓 Login as Student
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername("MuathStud1");
                      setLoginPassword("123456");
                      setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                    }}
                    className="w-full px-3 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#5AA89A", color: "#FFFFFF" }}
                    disabled={loginLoading}
                  >
                    🎓 Login as MuathStud1
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername("instructor");
                      setLoginPassword("instructor123");
                      setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                    }}
                    className="w-full px-3 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#8B7355", color: "#FFFFFF" }}
                    disabled={loginLoading}
                  >
                    👨‍🏫 Login as Instructor
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginUsername("admin");
                      setLoginPassword("admin123");
                      setTimeout(() => document.querySelector('form').requestSubmit(), 100);
                    }}
                    className="w-full px-3 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-opacity"
                    style={{ backgroundColor: "#8B4555", color: "#FFFFFF" }}
                    disabled={loginLoading}
                  >
                    🔐 Login as Admin
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* SIGNUP */}
          <div className="flex-1 p-6 rounded-lg" style={{ backgroundColor: "#393F56" }}>
            <h3 className="text-center text-xl font-semibold mb-6" style={{ color: "#FFFFFF" }}>
              Signup
            </h3>
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              {/* Role Toggle */}
              <div className="flex justify-center gap-2 mb-2">
                <button
                  type="button"
                  onClick={() => setSignupRole("student")}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${signupRole === "student" ? "ring-2 ring-blue-400" : ""}`}
                  style={{
                    backgroundColor: signupRole === "student" ? "#4A90A4" : "#676C80",
                    color: "#FFFFFF"
                  }}
                  disabled={signupLoading}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setSignupRole("instructor")}
                  className={`px-4 py-2 rounded-full font-semibold transition-all ${signupRole === "instructor" ? "ring-2 ring-blue-400" : ""}`}
                  style={{
                    backgroundColor: signupRole === "instructor" ? "#4A90A4" : "#676C80",
                    color: "#FFFFFF"
                  }}
                  disabled={signupLoading}
                >
                  Instructor
                </button>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="First Name"
                  value={signupFirstName}
                  onChange={(e) => setSignupFirstName(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                  style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
                  disabled={signupLoading}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={signupLastName}
                  onChange={(e) => setSignupLastName(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                  style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
                  disabled={signupLoading}
                />
              </div>
              <input
                type="text"
                placeholder="Enter Username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
                disabled={signupLoading}
              />
              <input
                type="email"
                placeholder="Enter Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
                disabled={signupLoading}
              />
              <input
                type="password"
                placeholder="Enter Password (min 6 chars)"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
                disabled={signupLoading}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
                disabled={signupLoading}
              />
              {signupError && <p className="text-red-300 text-sm text-center">{signupError}</p>}
              {signupSuccess && <p className="text-green-300 text-sm text-center">{signupSuccess}</p>}
              <button
                type="submit"
                className="w-full px-4 py-3 rounded-full font-semibold mt-2 disabled:opacity-50"
                style={{ backgroundColor: "#676C80", color: "#FFFFFF" }}
                disabled={signupLoading}
              >
                {signupLoading ? "Creating Account..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginSignup;

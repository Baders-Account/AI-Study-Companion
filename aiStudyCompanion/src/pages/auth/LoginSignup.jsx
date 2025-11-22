// pages/auth/LoginSignup.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginSignup() {
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupUsername, setSignupUsername] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const u = loginUsername.trim().toLowerCase();
    const p = loginPassword;

   if (u === "student" && p === "123") return navigate("/Dashboard");
  if (u === "instructor" && p === "123") return navigate("/instructor");
  if (u === "admin" && p === "123") return navigate("/admin"); // ✅ add this

  setLoginError("Invalid username or password. Try student/123, instructor/123, or admin/123.");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setSignupError("");
    setSignupSuccess("");

    if (!signupUsername || !signupEmail || !signupPassword || !signupConfirmPassword) {
      setSignupError("Please fill in all fields.");
      return;
    }
    if (signupPassword !== signupConfirmPassword) {
      setSignupError("Passwords do not match.");
      return;
    }
    setSignupSuccess("Account created (demo). You can log in with student/123 or instructor/123 or admin/123.");
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
                placeholder="Enter Username (student or instructor or admin)"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
              />
              <input
                type="password"
                placeholder="Enter Password (123)"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
              />
              {loginError && <p className="text-red-300 text-sm text-center">{loginError}</p>}
              <button type="submit" className="w-full px-4 py-3 rounded-full font-semibold mt-2" style={{ backgroundColor: "#676C80", color: "#FFFFFF" }}>
                Log In
              </button>
              <div className="text-center mt-2">
                <span className="text-xs text-gray-300">Demo: student/123 or instructor/123 or admin/123.</span>
              </div>
            </form>
          </div>

          {/* SIGNUP */}
          <div className="flex-1 p-6 rounded-lg" style={{ backgroundColor: "#393F56" }}>
            <h3 className="text-center text-xl font-semibold mb-6" style={{ color: "#FFFFFF" }}>
              Signup
            </h3>
            <form onSubmit={handleSignup} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter Username"
                value={signupUsername}
                onChange={(e) => setSignupUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
              />
              <input
                type="email"
                placeholder="Enter Email"
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={signupPassword}
                onChange={(e) => setSignupPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={signupConfirmPassword}
                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                style={{ backgroundColor: "#D9D9D9", color: "#676C80" }}
              />
              {signupError && <p className="text-red-300 text-sm text-center">{signupError}</p>}
              {signupSuccess && <p className="text-green-300 text-sm text-center">{signupSuccess}</p>}
              <button type="submit" className="w-full px-4 py-3 rounded-full font-semibold mt-2" style={{ backgroundColor: "#676C80", color: "#FFFFFF" }}>
                Create Account
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default LoginSignup;

import { useState } from "react";

function LoginSignup() {
    const [loginUsername, setLoginUsername] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [signupUsername, setSignupUsername] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupConfirmPassword, setSignupConfirmPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Login:", { loginUsername, loginPassword });
    };

    const handleSignup = (e) => {
        e.preventDefault();
        console.log("Signup:", { signupUsername, signupEmail, signupPassword, signupConfirmPassword });
    };

    return (
        <section className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#B0B1B4' }}>

            <header className="w-full max-w-4xl mb-8 px-4">
                <h1 className="text-center text-3xl font-bold py-4 rounded-lg" style={{ backgroundColor: '#676C80', color: '#FFFFFF' }}>
                    Login/Signup
                </h1>
            </header>

            <div className="w-full max-w-4xl p-6 rounded-lg" style={{ backgroundColor: '#2D2F36' }}>

                <div className="flex items-center justify-center mb-6">
                    <div className="mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: '#000000' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <div className="px-8 py-3 rounded-full" style={{ backgroundColor: '#676C80' }}>
                        <h2 className="text-xl font-semibold" style={{ color: '#FFFFFF' }}>
                            Welcome to, Study Companian
                        </h2>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6 justify-center">

                    <div className="flex-1 p-6 rounded-lg" style={{ backgroundColor: '#393F56' }}>
                        <h3 className="text-center text-xl font-semibold mb-6" style={{ color: '#FFFFFF' }}>
                            Login
                        </h3>
                        <form onSubmit={handleLogin} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Enter Username"
                                value={loginUsername}
                                onChange={(e) => setLoginUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                style={{ backgroundColor: '#D9D9D9', color: '#676C80' }}
                            />
                            <input
                                type="password"
                                placeholder="Enter Password"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                style={{ backgroundColor: '#D9D9D9', color: '#676C80' }}
                            />
                        </form>
                    </div>

                    <div className="flex-1 p-6 rounded-lg" style={{ backgroundColor: '#393F56' }}>
                        <h3 className="text-center text-xl font-semibold mb-6" style={{ color: '#FFFFFF' }}>
                            Signup
                        </h3>
                        <form onSubmit={handleSignup} className="flex flex-col gap-4">
                            <input
                                type="text"
                                placeholder="Enter First Name"
                                value={signupUsername}
                                onChange={(e) => setSignupUsername(e.target.value)}
                                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                style={{ backgroundColor: '#D9D9D9', color: '#676C80' }}
                            />
                            <input
                                type="email"
                                placeholder="Enter Last Name"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                style={{ backgroundColor: '#D9D9D9', color: '#676C80' }}
                            />
                            <input
                                type="password"
                                placeholder="Enter Email"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                style={{ backgroundColor: '#D9D9D9', color: '#676C80' }}
                            />
                            <input
                                type="password"
                                placeholder="Enter Password"
                                value={signupConfirmPassword}
                                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-full text-center focus:outline-none focus:ring-2 focus:ring-blue-400"
                                style={{ backgroundColor: '#D9D9D9', color: '#676C80' }}
                            />
                        </form>
                    </div>

                </div>
            </div>
        </section>
    );
}

export default LoginSignup;

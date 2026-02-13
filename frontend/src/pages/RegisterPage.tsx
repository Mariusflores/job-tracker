import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {registerApi} from "../api/auth";
import {useAuth} from "../context/AuthContext.tsx";

export function RegisterPage() {
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();
    const auth = useAuth();

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const passwordsDoNotMatch = confirmPassword.length > 0 && password !== confirmPassword;

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");


        if (passwordsDoNotMatch) {
            setError("Passwords do not match");
            return;
        }

        try {
            setIsSubmitting(true);
            const token = await registerApi({email, password, firstName, lastName});
            auth.login(token);
            navigate("/dashboard");
        } catch (err) {
            setError("Registration failed");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl text-gray-600 font-bold mb-6 text-center">
                    Create Account
                </h2>

                <input
                    type="text"
                    placeholder="First Name"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
                <input
                    type="text"
                    placeholder="Last Name"
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
                <div className="relative mb-4">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        className={`w-full px-4 py-2 border rounded-lg 
                        bg-white text-gray-800 placeholder-gray-500 
                        focus:outline-none focus:ring-2 transition-all duration-200
        ${
                            passwordsMatch
                                ? "border-green-500 focus:ring-green-500"
                                : passwordsDoNotMatch
                                    ? "border-red-500 focus:ring-red-500"
                                    : "border-gray-300 focus:ring-blue-500"
                        }`}
                        required
                    />

                    {passwordsMatch && (
                        <span className="absolute right-3 top-2.5 text-green-500 text-lg">
                            ✓
                        </span>
                    )}

                    {passwordsDoNotMatch && (
                        <span className="absolute right-3 top-2.5 text-red-500 text-lg">
                            ✕
                        </span>
                    )}
                </div>

                {error && (
                    <div className="text-red-500 text-sm mb-4">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                    {isSubmitting ? "Creating account..." : "Register"}
                </button>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
}

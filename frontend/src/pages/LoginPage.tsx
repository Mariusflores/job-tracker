import {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {loginApi} from "../api/auth";
import {useAuth} from "../context/AuthContext.tsx";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const auth = useAuth();

    useEffect(() => {
        if (import.meta.env.DEV) {
            console.log("Prefilling")
            setEmail("admin@test.com")
            setPassword("password")
        }
    }, []);


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        try {
            const token = await loginApi(email, password);
            auth.login(token)
            navigate("/dashboard");
        } catch (err) {
            setError("Invalid credentials");
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl text-gray-600 font-bold mb-6 text-center">
                    Login
                </h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full mb-4 px-4 py-2
                    border border-gray-300
                            rounded-lg
                            bg-white
                            text-gray-800
                            placeholder-gray-500
                            focus:outline-none
                            focus:ring-2 focus:ring-blue-500
                            focus:border-blue-500"
                    required
                />


                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full mb-4 px-4 py-2
                    border border-gray-300
                            rounded-lg
                            bg-white
                            text-gray-800
                            placeholder-gray-500
                            focus:outline-none
                            focus:ring-2 focus:ring-blue-500
                            focus:border-blue-500"
                    required
                />

                {error && (
                    <div className="text-red-500 text-sm mb-4">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    Login
                </button>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Don’t have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                    >
                        Sign up
                    </Link>
                </div>

            </form>


        </div>
    );
}

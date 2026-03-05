import {NavLink, useNavigate} from "react-router-dom";
import {useAuth} from "../../context/AuthContext.tsx";
import {useState} from "react";
import {ConfirmDialog} from "../shared/ConfirmDialog.tsx";
import {deleteUserApi} from "../../api/user.ts";

export function Navbar() {
    const navigate = useNavigate();
    const auth = useAuth();
    const [accountOpen, setAccountOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

    function handleLogout() {
        auth.logout();
        navigate("/login");
    }

    function handleConfirmDeleteOpen() {
        setConfirmDeleteOpen(true);
        setAccountOpen(false);


    }

    async function handleDeleteAccount() {
        try {
            await deleteUserApi()
            auth.logout()
            navigate("/login")
        } catch (err) {
            console.error("failed to delete account", err)
        }
    }


    return (
        <nav
            className="flex justify-between px-8 h-14 items-center border-b
                       bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
        >
            {/* Left side navigation */}
            <div className="flex gap-8">
                <NavLink
                    to="/dashboard"
                    className={({isActive}) =>
                        `pb-1 transition-colors ${
                            isActive
                                ? "font-semibold border-b-2 border-white text-white"
                                : "text-white/80 hover:text-white"
                        }`
                    }
                >
                    Dashboard
                </NavLink>

                <NavLink
                    to="/pipeline"
                    className={({isActive}) =>
                        `pb-1 transition-colors ${
                            isActive
                                ? "font-semibold border-b-2 border-white text-white"
                                : "text-white/80 hover:text-white"
                        }`
                    }
                >
                    Pipeline
                </NavLink>
            </div>

            <div>
                {/* Right side logout */}
                <button
                    onClick={() => setAccountOpen(!accountOpen)}
                    className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                    Account
                </button>
                {accountOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-3 flex flex-col gap-2">
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 rounded border border-gray-300 text-gray-700
                       hover:bg-gray-100 transition text-sm"
                        >
                            Logout
                        </button>

                        <button
                            onClick={handleConfirmDeleteOpen}
                            className="px-3 py-2 rounded bg-red-600 text-white
                       hover:bg-red-700 transition text-sm"
                        >
                            Delete Account
                        </button>
                    </div>
                )}
                <ConfirmDialog
                    open={confirmDeleteOpen}
                    title="Delete Account"
                    description="This action cannot be undone."
                    confirmText="Delete"
                    onCancel={() => setConfirmDeleteOpen(false)}
                    onConfirm={handleDeleteAccount}
                />
            </div>
        </nav>
    );
}

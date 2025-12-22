import {NavLink} from "react-router-dom";

export function Navbar() {
    return (
        <nav
            className="flex gap-8 px-8 h-14 items-center border-b bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
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
            {/*
                         <NavLink
                to="/settings"
                className={({isActive}) =>
                    `pb-1 transition-colors ${
                        isActive
                            ? "font-semibold border-b-2 border-white text-white"
                            : "text-white/80 hover:text-white"
                    }`
                }
            >
                Settings
            </NavLink>
             */}

        </nav>
    );
}

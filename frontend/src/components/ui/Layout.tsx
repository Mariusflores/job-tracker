import type {ReactNode} from "react";
import {Navbar} from "./NavBar.tsx";

export function Layout({children}: { children: ReactNode }) {
    return <div>
        <Navbar/>
        <main className="pt-6">{children}</main>
    </div>;
}
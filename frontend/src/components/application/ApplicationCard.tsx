import type {Application} from "../../types/application.ts";
import {StatusBadge} from "./StatusBadge.tsx";
import {useState} from "react";
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid";

export function ApplicationCard(props: { application: Application }) {
    const [open, setOpen] = useState(false)
    return <div
        className={" relative  space-y-4 bg-white rounded-lg shadow p-4 border hover:shadow-lg transition"}
    >
        <div className={"flex flex-row justify-between"}>
            <p className={"font-semibold text-2xl text-black"}>{props.application.jobTitle}</p>
            <div className={"flex flex-row justify-between gap-10"}>
                <p className={"text-gray-500"}>Applied: {props.application.appliedDate}</p>

                <StatusBadge status={props.application.status}/>
                {/* Kebab Menu Button */}
                <button
                    onClick={() => setOpen(!open)}
                    className="text-gray-400 hover:text-gray-600 rotate-90"
                >
                    <EllipsisVerticalIcon className="w-7 h-7"/>
                </button>

            </div>

        </div>

        <p className={"text-gray-500 text-lg"}>{props.application.companyName}</p>


        {/* Dropdown Menu */}
        {open && (
            <div className="absolute right-3 top-10 bg-white border shadow-lg rounded-md text-sm overflow-hidden">
                <button className="block text-black px-4 py-2 hover:bg-gray-100 w-full text-left">
                    Edit
                </button>
                <button className="block px-4 py-2 hover:bg-red-50 text-red-600 w-full text-left">
                    Delete
                </button>
            </div>
        )}

    </div>;
}
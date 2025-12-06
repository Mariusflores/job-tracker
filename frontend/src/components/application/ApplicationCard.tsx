import type {Application} from "../../types/application.ts";
import {StatusBadge} from "./StatusBadge.tsx";

export function ApplicationCard(props: { application: Application }) {
    return <div className={" space-y-4 bg-white rounded-lg shadow p-4 border hover:shadow-lg transition"}
    >
        <p className={"font-bold text-black"}>{props.application.jobTitle}</p>
        <p className={"text-gray-500"}>{props.application.companyName}</p>

        <StatusBadge status={props.application.status}/>
        <p className={"text-gray-500"}>{props.application.appliedDate}</p>

    </div>;
}
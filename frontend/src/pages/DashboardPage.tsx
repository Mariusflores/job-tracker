import {useEffect, useState} from "react";
import type {Application} from "../types/application.ts";
import {getApplications} from "../api/applications.ts";
import {StatusBadge} from "../components/ui/StatusBadge.tsx";


export function DashboardPage() {
    const [apps, setApps] = useState<Application[]>([])


    useEffect(() => {
        async function load() {
            const data = await getApplications();
            console.log(data)
            setApps(data)
        }

        load();
    }, []);

    console.log("Applications fetched: ", apps);
    return (
        <div className={"p-6 max-w-4xl mx-auto"}>
            <h1 className={"text-2xl font-bold mb-4"}>Your Applications</h1>
            {
                apps.map(item => (

                    <div key={item.id}
                         className={" space-y-4 bg-white rounded-lg shadow p-4 border hover:shadow-lg transition"}
                    >
                        <p className={"font-bold text-black"}>{item.jobTitle}</p>
                        <p className={"text-gray-500"}>{item.companyName}</p>

                        <StatusBadge status={item.status}/>
                        <p className={"text-gray-500"}>{item.appliedDate}</p>

                    </div>
                ))
            }
        </div>
    );
}
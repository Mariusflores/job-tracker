import {useEffect, useState} from "react";
import type {Application} from "../types/application.ts";
import {getApplications} from "../api/applications.ts";
import {ApplicationCard} from "../components/application/ApplicationCard.tsx";


export function DashboardPage() {
    const [apps, setApps] = useState<Application[]>([])


    useEffect(() => {
        async function load() {
            const data = await getApplications();
            setApps(data)
        }

        load();
    }, []);

    console.log("Applications fetched: ", apps);
    return (
        <div className={"p-6 max-w-4xl mx-auto"}>
            <h1 className={"text-2xl font-bold mb-4"}>Your Applications</h1>
            {
                apps.map(app => (

                    <ApplicationCard key={app.id} application={app}/>


                ))
            }
        </div>
    );
}
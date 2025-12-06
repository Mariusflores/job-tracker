import {useEffect, useState} from "react";
import type {Application, ApplicationRequest} from "../types/application.ts";
import {createApplication, getApplications} from "../api/applications.ts";
import {ApplicationCard} from "../components/application/ApplicationCard.tsx";
import {AddApplicationModal} from "../components/application/AddApplicationModal.tsx";


export function DashboardPage() {
    const [apps, setApps] = useState<Application[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    useEffect(() => {
        async function load() {
            const data = await getApplications();
            setApps(data)
        }

        load();
    }, []);

    async function handleSubmit(request: ApplicationRequest) {
        const newApp = await createApplication(request)

        console.log(newApp)
        setApps(prev => [...prev, newApp]);
    }

    function openModal() {
        console.log("setting modalopen = true")
        setIsModalOpen(true)
    }

    function closeModal() {
        setIsModalOpen(false)
    }

    console.log("Applications fetched: ", apps);
    return (
        <div className="min-h-screen bg-gray-50  flex justify-center">
            <div className="bg-white mt-20 space-y-4 p-6 md:p-10 w-full max-w-4xl mx-auto rounded-lg">
                <div className={"flex flex-row justify-between"}>
                    <h2 className="text-3xl text-black font-semibold mb-4">Dashboard</h2>
                    <button onClick={openModal}
                            className={"px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"}
                    >
                        + Add Application
                    </button>
                </div>
                <p className={"text-gray-500"}>Track your job search progress at a glance</p>

                {apps.map(app => (
                    <ApplicationCard key={app.id} application={app}/>
                ))}
                {isModalOpen &&
                    <AddApplicationModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit}/>}
            </div>
        </div>
    );

}
import {useEffect, useState} from "react";
import type {Application, ApplicationRequest} from "../types/application.ts";
import {createApplication, deleteApplication, getApplications, updateApplication} from "../api/applications.ts";
import {ApplicationCard} from "../components/application/ApplicationCard.tsx";
import {AddApplicationModal} from "../components/application/AddApplicationModal.tsx";
import Loader from "../components/ui/Loader.tsx";


export function DashboardPage() {
    const [apps, setApps] = useState<Application[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {

        loadApps();
    }, []);

    async function loadApps() {
        setIsLoading(true)
        const data = await getApplications();
        setApps(data)
        setIsLoading(false)
    }

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

    async function handleDelete(id: number) {
        setApps(prev => prev.filter(app => app.id !== id));

        try {
            await deleteApplication(id);
        } catch (error) {
            loadApps()
        }
    }

    async function handleEdit(id: number, request: ApplicationRequest) {

        try {
            await updateApplication(id, request);
        } catch (error) {
            loadApps()
        }
    }

    return (
        <div className="min-h-screen bg-gray-50  flex justify-center">
            <div className="bg-white shadow mt-20 space-y-4 p-6 md:p-10 w-full max-w-4xl mx-auto rounded-lg">
                <div className={"flex flex-row justify-between"}>
                    <h2 className="text-3xl text-black font-semibold mb-4">Dashboard</h2>
                    <button onClick={openModal}
                            className={"px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"}
                    >
                        + Add Application
                    </button>
                </div>
                <p className={"text-gray-500"}>Track your job search progress at a glance</p>
                {isLoading ? (
                    <Loader isLoading={isLoading}/>
                ) : (
                    apps.map(app => (
                        <ApplicationCard onDelete={handleDelete} onEdit={handleEdit} key={app.id} application={app}/>
                    ))
                )
                }
                {isModalOpen &&
                    <AddApplicationModal isOpen={isModalOpen} onClose={closeModal} onSubmit={handleSubmit}/>}
            </div>
        </div>
    );

}
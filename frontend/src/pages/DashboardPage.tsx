import {useEffect, useState} from "react";
import type {Application, ApplicationRequest} from "../types/application.ts";
import {createApplication, deleteApplication, getApplications, updateApplication} from "../api/applications.ts";
import {ApplicationCard} from "../components/application/ApplicationCard.tsx";
import {AddApplicationModal} from "../components/application/AddApplicationModal.tsx";
import Loader from "../components/ui/Loader.tsx";
import {IconButton} from "../components/ui/IconButton.tsx";
import {ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon} from "@heroicons/react/16/solid";


export function DashboardPage() {
    const SORTERS = {
        status: (a: Application, b: Application) => a.status.localeCompare(b.status),
        date: (a: Application, b: Application) => a.appliedDate.localeCompare(b.appliedDate),
        company: (a: Application, b: Application) => a.companyName.localeCompare(b.companyName),
        title: (a: Application, b: Application) => a.jobTitle.localeCompare(b.jobTitle),
    } as const;

    const SORT_LABELS: Record<string, string> = {
        date: "Applied Date",
        status: "Status",
        company: "Company",
        title: "Job Title",
    };


    const [apps, setApps] = useState<Application[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)
    const [sortType, setSortType] = useState("date")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const sortTypeLabel = SORT_LABELS[sortType] ?? "Unknown"

    useEffect(() => {

        loadApps();
    }, []);

    useEffect(() => {
        setApps(prev => sortApps(prev, sortType, sortDirection))
    }, [sortType, sortDirection])


    async function loadApps() {
        setIsLoading(true);
        const data = await getApplications();
        setApps(sortApps(data, sortType, sortDirection));
        setIsLoading(false);
    }


    function sortApps(apps: Application[], sortType: string, direction: "asc" | "desc") {
        const sorter = SORTERS[sortType as keyof typeof SORTERS];
        if (!sorter) return apps;
        const sorted = [...apps].sort(sorter);
        return direction === "asc" ? sorted : sorted.reverse();
    }


    async function handleSubmit(request: ApplicationRequest) {
        const newApp = await createApplication(request);

        console.log(newApp);
        setApps(prev => [...prev, newApp]);
    }

    async function handleDelete(id: number) {
        setApps(prev => prev.filter(app => app.id !== id));

        try {
            await deleteApplication(id);
        } catch (error) {
            loadApps();
        }
    }

    async function handleEdit(id: number, request: ApplicationRequest) {
        try {
            await updateApplication(id, request);

            setApps(prev =>
                prev.map(app =>
                    app.id === id
                        ? {...app, ...request} // merge new values into old item
                        : app
                )
            );

        } catch (error) {
            loadApps(); // fallback if update failed
        }
    }

    function openModal() {
        console.log("setting modalopen = true")
        setIsModalOpen(true)
    }

    function closeModal() {
        setIsModalOpen(false)
    }

    function toggleSortBar() {
        setIsSortOpen(!isSortOpen)
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

                <div className={"flex flex-row justify-between"}>
                    <p className="text-gray-500">
                        Sort by: <span
                        className="font-medium">{sortTypeLabel}</span>
                    </p>
                    <div className={"relative"}>
                        <div className={"flex items-center gap-2"}>
                            <IconButton
                                onClick={() => setSortDirection(prev => prev === "asc" ? "desc" : "asc")}
                                icon={
                                    sortDirection === "asc"
                                        ? <ArrowUpIcon className="w-5 h-5"/>
                                        : <ArrowDownIcon className="w-5 h-5"/>
                                }
                            />
                            <IconButton onClick={toggleSortBar} icon={<ArrowsUpDownIcon className={"w-5 h-5"}/>}/>

                        </div>
                        {isSortOpen && (
                            <div
                                className="absolute right-0 mt-2 bg-white border shadow-lg rounded-md text-sm z-50 w-40">
                                {Object.keys(SORTERS).map(key => (
                                    <button
                                        key={key}
                                        className={`block w-full text-black text-left px-4 py-2 
                                        hover:bg-gray-100
                                        ${sortType === key ? "bg-gray-100 font-semibold" : ""}
                                        `}
                                        onClick={() => {
                                            setSortType(key);
                                            setIsSortOpen(false);
                                        }}
                                    >
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

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
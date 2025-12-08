import {useEffect, useState} from "react";
import type {Application, ApplicationRequest} from "../types/application.ts";
import {createApplication, deleteApplication, getApplications, updateApplication} from "../api/applications.ts";
import {ApplicationCard} from "../components/application/cards/ApplicationCard.tsx";
import {AddApplicationModal} from "../components/application/modals/AddApplicationModal.tsx";
import Loader from "../components/ui/Loader.tsx";
import {StatusCard} from "../components/application/cards/StatusCard.tsx";
import {SORTERS} from "../constants/sorting.ts";
import {ToolBar} from "../components/application/toolbar/ToolBar.tsx";


export function DashboardPage() {
    const [apps, setApps] = useState<Application[]>([])
    const [allApps, setAllApps] = useState<Application[]>([])
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSortOpen, setIsSortOpen] = useState(false)
    const [sortType, setSortType] = useState("date")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [isFilterOpen, setIsFilterOpen] = useState(false)
    const [filterStatus, setFilterStatus] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState("");

    const totalCount = allApps.length;
    const appliedCount = allApps.filter(a => a.status == "APPLIED").length;
    const interviewCount = allApps.filter(a => a.status == "INTERVIEW").length;
    const offerCount = allApps.filter(a => a.status == "OFFER").length;

    useEffect(() => {
        loadApps();
    }, []);

    useEffect(() => {
        // Apply filters before sorting
        setApps(sortApps(applyFilters(allApps), sortType, sortDirection))
    }, [sortType, sortDirection, filterStatus, searchQuery])


    async function loadApps() {
        setIsLoading(true);
        const data = await getApplications();
        setAllApps(data)
        const filtered = applyFilters(data)
        setApps(sortApps(filtered, sortType, sortDirection));
        setIsLoading(false);
    }


    function sortApps(apps: Application[], sortType: string, direction: "asc" | "desc") {
        const sorter = SORTERS[sortType as keyof typeof SORTERS];
        if (!sorter) return apps;
        const sorted = [...apps].sort(sorter);
        return direction === "asc" ? sorted : sorted.reverse();
    }

    function applyFilters(apps: Application[]) {
        let result = apps;

        if (filterStatus) {
            result = result.filter(a => a.status === filterStatus);
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(a =>
                a.companyName.toLowerCase().includes(q) ||
                a.jobTitle.toLowerCase().includes(q)
            );
        }

        return result;
    }


    async function handleSubmit(request: ApplicationRequest) {
        const newApp = await createApplication(request);

        console.log(newApp);
        setAllApps(prev => [...prev, newApp]);
    }

    async function handleDelete(id: number) {
        setAllApps(prev => prev.filter(app => app.id !== id));

        try {
            await deleteApplication(id);
        } catch (error) {
            await loadApps();
        }
    }

    async function handleEdit(id: number, request: ApplicationRequest) {
        try {
            await updateApplication(id, request);

            setAllApps(prev =>
                prev.map(app =>
                    app.id === id
                        ? {...app, ...request} // merge new values into old item
                        : app
                )
            );

        } catch (error) {
            await loadApps(); // fallback if update failed
        }
    }

    function openModal() {
        setIsModalOpen(true)
    }

    function closeModal() {
        setIsModalOpen(false)
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

                <div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
                        <StatusCard label="Total" count={totalCount} color="gray"/>
                        <StatusCard label="Applied" count={appliedCount} color="blue"/>
                        <StatusCard label="Interviews" count={interviewCount} color="yellow"/>
                        <StatusCard label="Offers" count={offerCount} color="green"/>
                    </div>
                </div>
                <ToolBar
                    sortType={sortType}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isFilterOpen={isFilterOpen}
                    setIsFilterOpen={setIsFilterOpen}
                    filterStatus={filterStatus}
                    setFilterStatus={setFilterStatus}
                    isSortOpen={isSortOpen} setIsSortOpen={setIsSortOpen} setSortType={setSortType}
                    onToggleOpen={() => setIsSortOpen(!isSortOpen)}
                />

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
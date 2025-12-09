import {useEffect, useState} from "react";
import type {Application, ApplicationRequest} from "../types/application.ts";
import {ApplicationCard} from "../components/application/cards/ApplicationCard.tsx";
import {AddApplicationModal} from "../components/application/modals/AddApplicationModal.tsx";
import Loader from "../components/ui/Loader.tsx";
import {SORTERS} from "../constants/sorting.ts";
import {ToolBar} from "../components/application/toolbar/ToolBar.tsx";

import {StatusBar} from "../components/application/cards/StatusBar.tsx";

export function DashboardPage({allApps, handleSubmit, handleEdit, handleDelete, isLoading}: {
    allApps: Application[],
    handleSubmit: (request: ApplicationRequest) => void,
    handleEdit: (request: ApplicationRequest, id?: number) => void,
    handleDelete: (id: number) => void,
    isLoading: boolean
}) {
    const [apps, setApps] = useState<Application[]>([])

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
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
        // Apply filters before sorting
        setApps(sortApps(applyFilters(allApps), sortType, sortDirection))
    }, [sortType, sortDirection, filterStatus, searchQuery, allApps])


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

    function openModal() {
        setIsModalOpen(true)
    }

    function closeModal() {
        setIsModalOpen(false)
    }


    return (
        <div className="min-h-screen bg-gray-50  flex justify-center">
            <div className="bg-white shadow mt-15 space-y-4 p-6 md:p-10 w-full max-w-4xl mx-auto rounded-lg">
                <div className={"flex flex-row justify-between"}>
                    <h2 className="text-3xl text-black font-semibold mb-4">Dashboard</h2>
                    <button onClick={openModal}
                            className={"px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200"}
                    >
                        + Add Application
                    </button>
                </div>
                <p className={"text-gray-500"}>Track your job search progress at a glance</p>

                <StatusBar totalCount={totalCount}
                           appliedCount={appliedCount}
                           interviewCount={interviewCount}
                           offerCount={offerCount}
                           setFilterStatus={setFilterStatus}
                           filterStatus={filterStatus}
                />
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
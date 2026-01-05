import {useMemo, useState} from "react";
import type {Application, CreateApplicationRequest, UpdateApplicationRequest} from "../types/application.ts";
import {ApplicationCard} from "../components/application/cards/ApplicationCard.tsx";
import {AddApplicationModal} from "../components/application/modals/AddApplicationModal.tsx";
import Loader from "../components/shared/Loader.tsx";
import {ToolBar} from "../components/application/toolbar/ToolBar.tsx";

import {StatusBar} from "../components/application/cards/StatusBar.tsx";
import {countByStatus, filterApps, sortAppsBy} from "../utils/dashboard/dashboardUtils.ts";
import type {SORTERS} from "../constants/sorting.ts";
import type {Enrichment} from "../types/enrichment.ts";

export function DashboardPage({
                                  backendApps,
                                  handleSubmit,
                                  handleEdit,
                                  handleDelete,
                                  handleUpdateNotes,
                                  isLoading,
                                  onAutofill
                              }: {
    backendApps: Application[],
    handleSubmit: (request: CreateApplicationRequest) => Promise<void>,
    handleEdit: (request: UpdateApplicationRequest, id: number) => Promise<void>,
    handleDelete: (id: number) => void,
    handleUpdateNotes: (notes: string, id: number) => Promise<void>,
    onAutofill: (url: string) => Promise<Enrichment>,
    isLoading: boolean
}) {


    type SortKey = keyof typeof SORTERS;
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [openContextMenuId, setOpenContextMenuId] = useState<number | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
    const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
    const [statusFilter, setStatusFilter] = useState<string>("")
    const [searchQuery, setSearchQuery] = useState("");


    const totalCount = backendApps.length;
    const appliedCount = countByStatus(backendApps, "APPLIED");
    const interviewCount = countByStatus(backendApps, "INTERVIEW")
    const offerCount = countByStatus(backendApps, "OFFER")

    // Applications visible after filtering + sorting (derived from backend)
    const visibleApps = useMemo(() => {
        return sortAppsBy(filterApps(backendApps, statusFilter, searchQuery), sortKey, sortDirection);
    }, [backendApps, statusFilter, searchQuery, sortKey, sortDirection]);


    function openCreateModal() {
        setIsCreateModalOpen(true);
    }

    function closeCreateModal() {
        setIsCreateModalOpen(false);
    }

    function toggleContextMenuFor(appId: number) {
        setOpenContextMenuId(prev => (prev === appId ? null : appId));
    }

    return (
        <div className="min-h-screen flex justify-center">
            <div className="bg-white shadow mt-5 space-y-4 p-6 md:p-10 w-full max-w-4xl mx-auto rounded-lg">
                <div className={"flex flex-row justify-between"}>
                    <h2 className="text-3xl text-black font-semibold mb-4">Dashboard</h2>
                    <button onClick={openCreateModal}
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
                           setStatusFilter={setStatusFilter}
                           statusFilter={statusFilter}
                />
                <ToolBar
                    sortKey={sortKey}
                    sortDirection={sortDirection}
                    setSortDirection={setSortDirection}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    isFilterMenuOpen={isFilterMenuOpen}
                    statusFilter={statusFilter}
                    setStatusFilter={setStatusFilter}
                    isSortMenuOpen={isSortMenuOpen}
                    setSortKey={setSortKey}
                    toggleSortMenu={() => setIsSortMenuOpen(!isSortMenuOpen)}
                    toggleFilterMenu={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    closeFilterMenu={() => setIsFilterMenuOpen(false)}
                    closeSortMenu={() => setIsSortMenuOpen(false)}

                />

                {isLoading ? (
                    <Loader isLoading={isLoading}/>
                ) : (
                    visibleApps.map(app => (
                        <ApplicationCard key={app.id}
                                         onDelete={handleDelete}
                                         onEdit={handleEdit}
                                         updateNotes={handleUpdateNotes}
                                         application={app}
                                         isContextMenuOpen={openContextMenuId === app.id}
                                         toggleContextMenu={() => toggleContextMenuFor(app.id)}
                                         closeContextMenu={() => setOpenContextMenuId(null)}
                        />
                    ))
                )
                }
                {isCreateModalOpen &&
                    <AddApplicationModal isOpen={isCreateModalOpen}
                                         onClose={closeCreateModal}
                                         onSubmit={handleSubmit}
                                         onAutofill={onAutofill}
                    />}
            </div>
        </div>
    );

}
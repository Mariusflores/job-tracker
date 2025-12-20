import type {Application, ApplicationRequest} from "../../../types/application.ts";
import {StatusBadge} from "../badges/StatusBadge.tsx";
import {useState} from "react";
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid";
import {EditApplicationModal} from "../modals/EditApplicationModal.tsx";
import {IconButton} from "../../shared/IconButton.tsx";
import {ExpandedApplicationCard} from "../modals/ExpandedApplicationCard.tsx";
import {parseDate} from "../../../utils/date.ts";

export function ApplicationCard({application, onDelete, onEdit, onPublishNotes, isMenuOpen, onToggleMenu}: {
    application: Application,
    onDelete: (id: number) => void,
    isMenuOpen: boolean,
    onToggleMenu: () => void,
    onEdit: (request: ApplicationRequest, id?: number) => void,
    onPublishNotes: (notes: string, id?: number) => void
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expanded, setExpanded] = useState(false)

    function handleDelete() {
        onDelete(application.id);
        onToggleMenu();
    }


    function openModal() {
        setIsModalOpen(true);

    }

    function closeModal() {
        setIsModalOpen(false);
        onToggleMenu();
    }

    function toggleToolBar() {
        onToggleMenu();
    }

    return <div className={""}>

        {expanded && (
            <ExpandedApplicationCard expanded={expanded} onClose={() => setExpanded(false)} application={application}
                                     publishNotes={onPublishNotes}/>
        )}

        <div role={"button"}
             className={"relative  space-y-4 bg-white rounded-lg shadow p-4 border hover:shadow-lg transition "}
             onClick={() => setExpanded(true)}
        >
            <div className={"flex flex-row justify-between"}>
                <p className={"font-semibold text-2xl text-black"}>{application.companyName}</p>
                <div className={"flex flex-row justify-between gap-10"}>
                    <p className={"text-gray-500"}>Applied: {parseDate(application.appliedDate)}</p>

                    <StatusBadge status={application.status}/>
                    {/* Kebab Menu Button */}

                    <IconButton onClick={(e) => {
                        e.stopPropagation()
                        toggleToolBar()
                    }}
                                icon={<EllipsisVerticalIcon className="w-7 h-7 rotate-90"/>}/>
                </div>

            </div>

            <p className={"text-gray-500 text-lg"}>{application.jobTitle}</p>


            {/* Dropdown Menu */}
            {isMenuOpen && (
                <div onClick={(e) => e.stopPropagation()}
                     className="absolute right-3 top-10 bg-white border shadow-lg rounded-md text-sm overflow-hidden">
                    <button onClick={() => {
                        openModal()
                    }}
                            className="block text-black px-4 py-2 hover:bg-gray-100 w-full text-left">
                        Edit
                    </button>
                    <button onClick={handleDelete}
                            className="block px-4 py-2 hover:bg-red-50 text-red-600 w-full text-left">
                        Delete
                    </button>
                </div>
            )}
            {/* Edit Application Modal */}
            {isModalOpen && <EditApplicationModal isOpen={isModalOpen} onClose={closeModal} onSubmit={onEdit}
                                                  application={application}/>}

        </div>


    </div>;
}
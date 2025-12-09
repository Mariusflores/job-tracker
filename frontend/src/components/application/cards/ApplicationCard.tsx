import type {Application, ApplicationRequest} from "../../../types/application.ts";
import {StatusBadge} from "../badges/StatusBadge.tsx";
import {useState} from "react";
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid";
import {EditApplicationModal} from "../modals/EditApplicationModal.tsx";
import {IconButton} from "../../ui/IconButton.tsx";

export function ApplicationCard({application, onDelete, onEdit}: {
    application: Application,
    onDelete: (id: number) => void,
    onEdit: (request: ApplicationRequest, id?: number) => void
}) {
    const [toolBarOpen, setToolBarOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [expanded, setExpanded] = useState(false)

    function handleDelete() {
        onDelete(application.id);
        setToolBarOpen(!toolBarOpen);
    }

    function openModal() {
        setIsModalOpen(true);

    }

    function closeModal() {
        console.log("Closing modal")
        setIsModalOpen(false);
        setToolBarOpen(!toolBarOpen);
    }

    function toggleToolBar() {
        setToolBarOpen(!toolBarOpen);
    }

    return <div className={""}>
        {expanded && (
            <div></div>
        )}

        {!expanded && (
            <div role={"button"}
                 className={"relative  space-y-4 bg-white rounded-lg shadow p-4 border hover:shadow-lg transition "}
                 onClick={() => setExpanded(true)}
            >
                <div className={"flex flex-row justify-between"}>
                    <p className={"font-semibold text-2xl text-black"}>{application.jobTitle}</p>
                    <div className={"flex flex-row justify-between gap-10"}>
                        <p className={"text-gray-500"}>Applied: {application.appliedDate}</p>

                        <StatusBadge status={application.status}/>
                        {/* Kebab Menu Button */}

                        <IconButton onClick={(e) => {
                            e.stopPropagation()
                            toggleToolBar()
                        }}
                                    icon={<EllipsisVerticalIcon className="w-7 h-7 rotate-90"/>}/>
                    </div>

                </div>

                <p className={"text-gray-500 text-lg"}>{application.companyName}</p>


                {/* Dropdown Menu */}
                {toolBarOpen && (
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
        )}

    </div>;
}
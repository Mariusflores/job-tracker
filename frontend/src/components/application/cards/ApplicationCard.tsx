import type {Application, UpdateApplicationRequest} from "../../../types/application.ts";
import {StatusBadge} from "../badges/StatusBadge.tsx";
import {useRef, useState} from "react";
import {EllipsisVerticalIcon} from "@heroicons/react/20/solid";
import {EditApplicationModal} from "../modals/EditApplicationModal.tsx";
import {IconButton} from "../../shared/IconButton.tsx";
import {ExpandedApplicationCard} from "../modals/ExpandedApplicationCard.tsx";
import {parseDate} from "../../../utils/date.ts";
import {useOutsideClick} from "../../../hooks/useOutsideClick.ts";
import {useEscapeKey} from "../../../hooks/useEscapeKey.ts";

export function ApplicationCard({
                                    application,
                                    onDelete,
                                    onEdit,
                                    updateNotes,
                                    isContextMenuOpen,
                                    toggleContextMenu,
                                    closeContextMenu
                                }: {
    application: Application,
    onDelete: (id: number) => void,
    isContextMenuOpen: boolean,
    toggleContextMenu: () => void,
    closeContextMenu: () => void,
    onEdit: (request: UpdateApplicationRequest, id: number) => Promise<void>,
    updateNotes: (notes: string, id: number) => Promise<void>
}) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const menuRef = useRef<HTMLDivElement | null>(null);

    useOutsideClick(menuRef, isContextMenuOpen, closeContextMenu);
    useEscapeKey(() => closeContextMenu());

    function handleDelete() {
        onDelete(application.id);
        closeContextMenu();
    }


    function openEditModal() {
        closeContextMenu();
        setIsEditModalOpen(true);

    }

    function closeEditModal() {
        setIsEditModalOpen(false);
    }

    function openExpandedView() {
        setIsExpanded(true);
    }

    return <div className={""}>

        {isExpanded && (
            <ExpandedApplicationCard expanded={isExpanded}
                                     onClose={() => setIsExpanded(false)}
                                     application={application}
                                     updateNotes={updateNotes}/>
        )}

        <div role={"button"}
             className={"relative  space-y-4 bg-white rounded-lg shadow p-4 border hover:shadow-lg transition "}
             onClick={openExpandedView}
        >
            <div className={"flex flex-row justify-between"}>
                <p className={"font-semibold text-2xl text-black"}>{application.companyName}</p>
                <div className={"flex flex-row justify-between gap-10"}>
                    <p className={"text-gray-500"}>Applied: {parseDate(application.appliedDate)}</p>

                    <StatusBadge status={application.status}/>
                    {/* Kebab Menu Button */}

                    <div ref={menuRef}>
                        <IconButton onClick={(e) => {
                            e.stopPropagation();
                            toggleContextMenu();
                        }}
                                    icon={<EllipsisVerticalIcon className="w-7 h-7 rotate-90"/>}/>

                        {/* Dropdown Menu */}
                        {isContextMenuOpen && (
                            <div onClick={(e) => e.stopPropagation()}
                                 className="absolute right-3 top-10 bg-white border shadow-lg rounded-md text-sm overflow-hidden">
                                <button onClick={() => {
                                    openEditModal()
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
                    </div>

                </div>

            </div>

            <p className={"text-gray-500 text-lg"}>{application.jobTitle}</p>


        </div>
        {/* Edit Application Modal */}
        {isEditModalOpen && <EditApplicationModal isOpen={isEditModalOpen} onClose={closeEditModal} onSubmit={onEdit}
                                                  application={application}/>}


    </div>;
}
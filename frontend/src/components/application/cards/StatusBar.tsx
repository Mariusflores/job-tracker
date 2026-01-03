import {StatusCard} from "./StatusCard.tsx";

export function StatusBar({totalCount, appliedCount, interviewCount, offerCount, setStatusFilter, statusFilter}: {
    totalCount: number,
    appliedCount: number,
    interviewCount: number,
    offerCount: number,
    setStatusFilter: (value: string) => void
    statusFilter: string
}) {

    return <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            <StatusCard label="Total" count={totalCount} color="gray" setFilterStatus={setStatusFilter}
                        filterType={""} active={statusFilter === ""}/>
            <StatusCard label="Applied" count={appliedCount} color="blue" setFilterStatus={setStatusFilter}
                        filterType={"APPLIED"} active={statusFilter === "APPLIED"}/>
            <StatusCard label="Interviews" count={interviewCount} color="yellow" setFilterStatus={setStatusFilter}
                        filterType={"INTERVIEW"} active={statusFilter === "INTERVIEW"}/>
            <StatusCard label="Offers" count={offerCount} color="green" setFilterStatus={setStatusFilter}
                        filterType={"OFFER"} active={statusFilter === "OFFER"}/>
        </div>
    </div>
}
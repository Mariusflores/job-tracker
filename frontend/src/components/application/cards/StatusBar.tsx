import {StatusCard} from "./StatusCard.tsx";

export function StatusBar({totalCount, appliedCount, interviewCount, offerCount, setFilterStatus, filterStatus}: {
    totalCount: number,
    appliedCount: number,
    interviewCount: number,
    offerCount: number,
    setFilterStatus: (value: string) => void
    filterStatus: string
}) {

    return <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            <StatusCard label="Total" count={totalCount} color="gray" setFilterStatus={setFilterStatus}
                        filterType={""} active={filterStatus === ""}/>
            <StatusCard label="Applied" count={appliedCount} color="blue" setFilterStatus={setFilterStatus}
                        filterType={"APPLIED"} active={filterStatus === "APPLIED"}/>
            <StatusCard label="Interviews" count={interviewCount} color="yellow" setFilterStatus={setFilterStatus}
                        filterType={"INTERVIEW"} active={filterStatus === "INTERVIEW"}/>
            <StatusCard label="Offers" count={offerCount} color="green" setFilterStatus={setFilterStatus}
                        filterType={"OFFER"} active={filterStatus === "OFFER"}/>
        </div>
    </div>
}
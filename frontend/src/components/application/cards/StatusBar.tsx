import {StatusCard} from "./StatusCard.tsx";

export function StatusBar({totalCount, appliedCount, interviewCount, offerCount}: {
    totalCount: number,
    appliedCount: number,
    interviewCount: number,
    offerCount: number,
}) {
    return <div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
            <StatusCard label="Total" count={totalCount} color="gray"/>
            <StatusCard label="Applied" count={appliedCount} color="blue"/>
            <StatusCard label="Interviews" count={interviewCount} color="yellow"/>
            <StatusCard label="Offers" count={offerCount} color="green"/>
        </div>
    </div>
}
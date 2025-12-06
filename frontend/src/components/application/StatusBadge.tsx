const STATUS_UI = {
    APPLIED: {
        label: "Applied",
        classes: "bg-blue-100 text-blue-700",
    },
    INTERVIEW: {
        label: "Interview",
        classes: "bg-yellow-100 text-yellow-700",
    },
    OFFER: {
        label: "Offer",
        classes: "bg-green-100 text-green-700",
    },
    REJECTED: {
        label: "Rejected",
        classes: "bg-red-100 text-red-700",
    },
    DEFAULT: {
        label: "Unknown",
        classes: "bg-gray-200 text-gray-700",
    },
} as const;

export function StatusBadge(props: { status: string }) {
    const ui = STATUS_UI[props.status as keyof typeof STATUS_UI] ?? STATUS_UI.DEFAULT

    return (
        <span className={`px-2 py-1 rounded text-sm font-semibold ${ui.classes}`}>
            {ui.label}
        </span>
    )

}
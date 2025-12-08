export const STATUS_UI = {
    APPLIED: {
        label: "Applied",
        classes: "bg-blue-700 text-blue-100",
    },
    INTERVIEW: {
        label: "Interview",
        classes: "bg-yellow-700 text-yellow-100",
    },
    OFFER: {
        label: "Offer",
        classes: "bg-green-700 text-green-100",
    },
    REJECTED: {
        label: "Rejected",
        classes: "bg-red-700 text-red-100",
    },
    DEFAULT: {
        label: "Unknown",
        classes: "bg-gray-700 text-gray-200",
    },
} as const;
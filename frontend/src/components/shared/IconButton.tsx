export function IconButton({onClick, icon}: {
    onClick: (e?: any) => void,
    icon: React.ReactNode
}) {
    return <button
        onClick={onClick}
        className="text-gray-400 hover:text-gray-600"
    >
        {icon}
    </button>
}
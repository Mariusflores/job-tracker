export function IconButton(props: {
    onClick: () => void,
    icon: React.ReactNode
}) {
    return <button
        onClick={props.onClick}
        className="text-gray-400 hover:text-gray-600"
    >
        {props.icon}
    </button>
}
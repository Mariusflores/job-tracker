type IconButtonProps = {
    icon: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onPointerDown?: (e: React.PointerEvent<HTMLButtonElement>) => void;
};

export function IconButton({
                               icon, onClick, onPointerDown
                           }: IconButtonProps) {
    return (
        <button
            onClick={onClick}
            onPointerDown={onPointerDown}
            className="text-gray-400 hover:text-gray-600"
        >
            {icon}
        </button>
    );
}

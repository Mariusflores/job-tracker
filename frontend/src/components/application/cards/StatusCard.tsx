export function StatusCard({label, count, color, setFilterStatus, filterType, active}:
                           {
                               label: string,
                               count: any,
                               color: string,
                               setFilterStatus: (value: string) => void,
                               filterType: string,
                               active: boolean
                           }) {
    const border = {
        gray: "border-gray-400",
        blue: "border-blue-700",
        yellow: "border-yellow-700",
        green: "border-green-700",
    }[color];

    function activate() {
        setFilterStatus(filterType);
    }

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={activate}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") activate();
            }}
            className={`p-4 rounded-lg bg-white cursor-pointer
            transition-all duration-200 ease-out
            hover:shadow-md hover:scale-[1.02]
            ${border}
            ${active
                ? "border-l-[12px] shadow-lg bg-gray-50 scale-[1.03]"
                : "border-l-4 shadow-sm"
            }
`}
        >
            <p className="text-sm text-gray-700">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
    );
}

export function StatusCard({label, count, color}: { label: string, count: any, color: string }) {
    const border = {
        gray: "border-gray-400",
        blue: "border-blue-700",
        yellow: "border-yellow-700",
        green: "border-green-700",
    }[color];

    return (
        <div className={`p-4 rounded-lg bg-white border-l-4 ${border} shadow-sm`}>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold text-gray-900">{count}</p>
        </div>
    );
}
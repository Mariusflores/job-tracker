import {STATUS_UI} from "../../../constants/status.ts";

export function StatusBadge(props: { status: string }) {
    const ui = STATUS_UI[props.status as keyof typeof STATUS_UI] ?? STATUS_UI.DEFAULT

    return (
        <span className={`px-2 py-1 rounded text-sm font-semibold ${ui.classes}`}>
            {ui.label}
        </span>
    )

}
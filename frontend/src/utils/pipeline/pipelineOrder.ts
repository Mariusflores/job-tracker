import type {Application, ApplicationStatus} from "../../types/application.ts";

export const STATUSES = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;

// Syncs backend application updates into a locally ordered list without changing item order
export function mergeBackendApps(
    localOrdered: Application[],
    backendSnapshot: Application[]
): Application[] {
    const backendById = new Map(backendSnapshot.map(a => [a.id, a]));

    const updated = localOrdered
        .map(app => {
            const backendApp = backendById.get(app.id);
            return backendApp ? {...app, ...backendApp} : app;
        })
        .filter(app => backendById.has(app.id));

    const newApps = backendSnapshot.filter(
        app => !localOrdered.some(l => l.id === app.id)
    );

    return [...updated, ...newApps];
}

// overId may be either a column id (status) or a card id
export function resolveTargetStatus(
    overId: unknown,
    pipelineApps: Application[]
): ApplicationStatus | null {
    if (STATUSES.includes(overId as ApplicationStatus)) {
        return overId as ApplicationStatus;
    }

    const overApp = pipelineApps.find(a => a.id === overId);
    return overApp?.status ?? null;
}

// Moves an application to the end of its target status column while preserving all other ordering
export function moveAppToBottomOfStatus(
    apps: Application[],
    appId: number,
    targetStatus: ApplicationStatus
): Application[] {
    const moving = apps.find(a => a.id === appId);
    if (!moving) return apps;

    const remaining = apps.filter(a => a.id !== appId);

    const lastIndex =
        remaining.reduce<number | null>((idx, app, i) =>
                app.status === targetStatus ? i : idx
            , null);

    const updated = {...moving, status: targetStatus};

    if (lastIndex === null) {
        return [...remaining, updated];
    }

    return [
        ...remaining.slice(0, lastIndex + 1),
        updated,
        ...remaining.slice(lastIndex + 1),
    ];
}
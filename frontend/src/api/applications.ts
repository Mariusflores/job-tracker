import {api} from "./client.ts"
import type {
    Application,
    ApplicationStatus,
    CreateApplicationRequest,
    StatusChange,
    UpdateApplicationRequest
} from "../types/application.ts";
import type {PagedResponse} from "../types/pagination.ts";

// GET
export async function getApplications(
    limit: number,
    cursor: string | null): Promise<PagedResponse<Application>> {

    const params: Record<string, string | number> = {limit};

    if (cursor) {
        params.cursor = cursor;
    }

    const response = await api.get<PagedResponse<Application>>(
        "/application",
        {params}
    );

    return response.data;
}

export async function getStatusHistoryApi(applicationId: number) {
    const response = await api.get<StatusChange[]>("/application/" + applicationId + "/status-history")
    return response.data;
}

// POST
export async function createApplicationApi(request: CreateApplicationRequest) {
    const response = await api.post<Application>("/application", request);
    return response.data;
}

// DELETE

export async function deleteApplicationApi(applicationId: number) {
    const response = await api.delete("/application/" + applicationId);
    return response.data;
}


// PATCH

export async function updateApplicationApi(applicationId: number, request: UpdateApplicationRequest) {
    const response = await api.patch("/application/" + applicationId, request)
    return response.data;
}

export async function updateApplicationStatusApi(
    applicationId: number,
    status: ApplicationStatus
): Promise<Application> {
    const response = await api.patch<Application>(
        `/application/${applicationId}/status`,
        {applicationStatus: status}
    );
    return response.data;
}

export async function updateApplicationNotesApi(
    applicationId: number,
    notes: string
): Promise<Application> {
    const response = await api.patch<Application>(
        `/application/${applicationId}/notes`,
        {notes}
    );
    return response.data;
}
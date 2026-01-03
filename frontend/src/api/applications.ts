import {api} from "./client.ts"
import type {
    Application,
    ApplicationStatus,
    CreateApplicationRequest,
    UpdateApplicationRequest
} from "../types/application.ts";

export async function getApplications() {
    const response = await api.get<Application[]>("/application/all")
    return response.data;
}

export async function createApplicationApi(request: CreateApplicationRequest) {
    const response = await api.post<Application>("/application", request);
    return response.data;
}

export async function deleteApplicationApi(id: number) {
    const response = await api.delete("/application/" + id);
    return response.data;
}


export async function updateApplicationApi(id: number, request: UpdateApplicationRequest) {
    const response = await api.patch("/application/" + id, request)
    return response.data;
}

export async function updateApplicationStatusApi(
    id: number,
    status: ApplicationStatus
): Promise<Application> {
    const response = await api.patch<Application>(
        `/application/${id}/status`,
        {applicationStatus: status}
    );
    return response.data;
}

export async function updateApplicationNotesApi(
    id: number,
    notes: string
): Promise<Application> {
    const response = await api.patch<Application>(
        `/application/${id}/notes`,
        {notes}
    );
    return response.data;
}
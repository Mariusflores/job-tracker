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

export async function createApplication(request: CreateApplicationRequest) {
    const response = await api.post<Application>("/application", request);
    return response.data;
}

export async function deleteApplication(id: number) {
    const response = await api.delete("/application/" + id);
    return response.data;
}


export async function updateApplication(id: number, request: UpdateApplicationRequest) {
    const response = await api.patch("/application/" + id, request)
    return response.data;
}

export async function updateApplicationStatus(
    id: number,
    status: ApplicationStatus
): Promise<Application> {
    const response = await api.patch<Application>(
        `/application/${id}/status`,
        {applicationStatus: status}
    );
    return response.data;
}

export async function updateApplicationNotes(
    id: number,
    notes: string
): Promise<Application> {
    const response = await api.patch<Application>(
        `/application/${id}/notes`,
        {notes}
    );
    return response.data;
}
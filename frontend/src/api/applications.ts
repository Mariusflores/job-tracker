import {api} from "./client.ts"
import type {Application, CreateApplicationRequest, UpdateApplicationRequest} from "../types/application.ts";

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

// TODO Update to patch
export async function updateApplication(id: number, request: UpdateApplicationRequest) {
    const response = await api.put("/application/" + id, request)
    return response.data;
}

export async function updateApplicationStatus(id: number, status: string) {
    const response = await api.patch<string>(
        "/application/" + id + "/status",
        {status},
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
    )
    return response.data;
}

export async function updateApplicationNotes(id: number, notes: string) {
    const response = await api.patch<string>(
        "/application/" + id + "/notes",
        {notes},
        {
            headers: {
                "Content-Type": "application/json",
            }
        }
    )
    return response.data;
}
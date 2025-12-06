import {api} from "./client.ts"
import type {Application, ApplicationRequest} from "../types/application.ts";

export async function getApplications() {
    const response = await api.get<Application[]>("/application/all")
    return response.data;
}

export async function createApplication(data: ApplicationRequest) {
    const response = await api.post("/application", data);
    return response.data
}
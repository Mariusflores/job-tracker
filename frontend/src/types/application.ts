export interface Application {
    id: number;
    jobTitle: string;
    companyName: string;
    descriptionUrl: string;
    status: string;
    appliedDate: string;
    notes: string
}

export type ApplicationData = Omit<Application, "id">;

export type ApplicationRequest = ApplicationData;

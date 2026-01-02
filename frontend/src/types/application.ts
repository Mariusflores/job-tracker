export interface Application {
    id: number;
    jobTitle: string;
    companyName: string;
    descriptionUrl: string;
    status: ApplicationStatus;
    appliedDate: string;
    notes: string
}

export type ApplicationData = Omit<Application, "id">;

export type CreateApplicationRequest = ApplicationData;

export type UpdateApplicationRequest =
    Partial<Omit<Application, "id">>;

export type ApplicationStatus =
    | "APPLIED"
    | "INTERVIEW"
    | "OFFER"
    | "REJECTED";

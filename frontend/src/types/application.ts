export interface Application {
    id: number;
    jobTitle: string;
    companyName: string;
    descriptionUrl: string;
    status: ApplicationStatus;
    appliedDate: string;
    notes: string
}

export interface StatusChange {
    id: number;
    applicationId: number;
    fromStatus: ApplicationStatus;
    toStatus: ApplicationStatus;
    changedAt: string;
}

export type ApplicationData = Omit<Application, "id">;

export type CreateApplicationRequest = ApplicationData;

export type UpdateApplicationRequest =
    Partial<Omit<Application, "id">>;

export type ApplicationStatus =
    | "DRAFT"
    | "APPLIED"
    | "INTERVIEW"
    | "OFFER"
    | "REJECTED";

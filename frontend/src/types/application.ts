export interface Application {
    id: number;
    jobTitle: string;
    companyName: string;
    descriptionUrl: string;
    status: string;
    appliedDate: string;
}

export interface ApplicationRequest {
    jobTitle: string;
    companyName: string;
    descriptionUrl: string;
    status: string;
    appliedDate: Date
}
export type PagedResponse<T> = {
    content: T[];
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
};
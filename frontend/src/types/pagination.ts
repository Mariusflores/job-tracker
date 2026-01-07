export type PagedResponse<T> = {
    content: T[];
    nextCursor: string;
    hasMore: boolean;

};
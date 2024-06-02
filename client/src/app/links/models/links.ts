export class LinkParams {
    maxExpiryDate = 8640;
    pageNumber = 1;
    pageSize = 9;
    orderBy = 'newest';
    all = false;
    
    constructor(maxExpiryDate?: number, pageNumber?: number, pageSize?: number, orderBy?: string, all?: boolean){}
}

export interface Link {
    id: number;
    shortLink: string;
    link: string;
    created: string;
    expiryDate?: string;
    userId: number;
    usageCount: number;
}

export interface Pagination {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export class PaginatedResult<T> {
    result?: T;
    pagination?: Pagination;
}
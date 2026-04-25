// export type Pagination = {
//     current_page: number,
//     page_size: number,
//     total_items: number,
//     total_pages: number,
//     has_next: boolean,
//     has_previous: boolean,
//     next_page: number,
//     previous_page: number,
// }

// export type PaginationParams = {
//     page: number,
//     limit: number
// }


export type CursorMeta = {
    next_cursor: string | null;
    has_next: boolean;
    prev_cursor?: string | null;
};

export type CursorPaginationParams = {
    cursor?: string | null;
    limit: number;
};

export type CursorResponse<T> = {
    items: T[];
    meta: CursorMeta;
};
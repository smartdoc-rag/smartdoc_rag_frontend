export type Pagination = {
    current_page: number,
    page_size: number,
    total_items: number,
    total_pages: number,
    has_next: boolean,
    has_previous: boolean,
    next_page: number,
    previous_page: number,
}

export type PaginationParams = {
    page: number,
    limit: number
}
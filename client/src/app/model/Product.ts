export interface Product {
    id: number,
    name: string,
    price: number
}

export interface ApiResponse<T> {
    data: T;
}
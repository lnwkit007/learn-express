export interface User {
    id: number,
    fname: string,
    lname: string,
    username: string,
    email: string,
    avatar?: string
}

export interface ApiResponse<T> {
    data: T;
}
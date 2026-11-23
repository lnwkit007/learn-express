import { inject, Service } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { User, ApiResponse } from '../../model/User';
import { catchError, throwError, map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CreateUserRequest {
    fname: string,
    lname: string,
    username: string,
    email: string
}

export type UpdateUserRequest = Partial<CreateUserRequest>;

@Service()
export class UserService {
    private readonly http = inject(HttpClient);

    getUsers(): Observable<User[]> {
        return this.http.get<ApiResponse<User[]>>(`${environment.apiUrl}/users`)
            .pipe(
                map(res => res.data),
                catchError(this.handleError)
            );
    }

    getUser(id: number): Observable<User> {
        return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/users/${id}`)
            .pipe(
                map(res => res.data),
                catchError(this.handleError)
            )
    }

    createUser(body: CreateUserRequest): Observable<User> {
        return this.http.post<ApiResponse<User>>(`${environment.apiUrl}/users`, body)
        .pipe(
            map((res) => res.data),
            catchError(this.handleError)
        )
    }

    updateUser(id: number, body: UpdateUserRequest): Observable<User> {
        return this.http.patch<ApiResponse<User>>(`${environment.apiUrl}/users/${id}`, body)
        .pipe(
            map((res) => res.data),
            catchError(this.handleError)
        )
    }

    deleteUser(id: number): Observable<{message: string}> {
        return this.http.delete<{message: string}>(`${environment.apiUrl}/users/${id}`)
        .pipe(
            catchError(this.handleError)
        )
    }

    private handleError(error: HttpErrorResponse) {
        console.log("Api error : ", error);
        return throwError(() => error);
    }
}

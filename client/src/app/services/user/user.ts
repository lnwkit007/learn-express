import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, User } from '../../interfaces/User';
import { catchError, throwError, map } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Service()
export class UserServices {
    private http = inject(HttpClient);

    getUsers() {
        return this.http.get<ApiResponse<User[]>>(`${environment.apiUrl}/users`)
        .pipe(
            map(res => res.data),
            catchError(error => {
                console.log("Api error : ", error);
                return throwError(() => error);
            })
        );
    }

    getUser(id: number) {
        return this.http.get<ApiResponse<User>>(`${environment.apiUrl}/users/${id}`)
        .pipe(
            map(res => res.data),
            catchError(error => {
                console.log("Api error : ", error);
                return throwError(() => error);
            })
        )
    }
}

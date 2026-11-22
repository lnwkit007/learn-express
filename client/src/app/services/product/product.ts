import { inject, Service } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Product, ApiResponse } from '../../model/Product';

export interface CreateProductRequest {
    name: string,
    price: number
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

@Service()
export class ProductService {
    private readonly http = inject(HttpClient);

    getProducts(): Observable<Product[]> {
        return this.http.get<ApiResponse<Product[]>>(`${environment.apiUrl}/products`)
            .pipe(
                map((res) => res.data),
                catchError(this.handleError)
            )
    }

    getProduct(id: number): Observable<Product> {
        return this.http.get<ApiResponse<Product>>(`${environment.apiUrl}/products/${id}`)
            .pipe(
                map((res) => res.data),
                catchError(this.handleError)
            )
    }

    postProduct(body: CreateProductRequest): Observable<Product> {
        return this.http.post<ApiResponse<Product>>(`${environment.apiUrl}/products`, body)
            .pipe(
                map((res) => res.data),
                catchError(this.handleError)
            )
    }

    updateProduct(id: number, body: UpdateProductRequest): Observable<Product> {
        return this.http.patch<ApiResponse<Product>>(`${environment.apiUrl}/products/${id}`, body)
            .pipe(
                map((res) => res.data),
                catchError(this.handleError)
            )
    }

    deleteProduct(id: number): Observable<{ message: string }> {
        return this.http.delete<{ message: string, error: HttpErrorResponse }>(`${environment.apiUrl}/products/${id}`)
            .pipe(
                catchError(this.handleError)
            )
    }

    private handleError(error: HttpErrorResponse) {
        console.log("Api error : ", error);
        return throwError(() => error);
    }
}

import { Component, inject, signal, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductService, CreateProductRequest } from '../../services/product/product';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-product-create',
  templateUrl: './product-create.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCreate {
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly submitting = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  protected readonly formCreateProduct = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    price: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)])
  });

  protected onSubmit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.formCreateProduct.invalid) {
      this.formCreateProduct.markAllAsTouched();
      return;
    }

    const body = this.buildChanges();

    if (!body) {
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.productService.postProduct(body)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.submitting.set(false);
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(this.toMessage(err))
        }
      })
  }

  private buildChanges(): CreateProductRequest | null {
    const { name , price } = this.formCreateProduct.controls;

    if (price.value === null) {
      return null;
    }

    return {
      name: name.value.trim(),
      price: price.value
    }
  }

  private toMessage(error: HttpErrorResponse): string {
    if (error.status === 400 || error.status === 422) {
      return 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
    }
    if (error.status === 409) {
      return 'มีสินค้านี้อยู่แล้ว';
    }
    if (error.status === 0) {
      return 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
    }
    return 'บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
  }
}

import { Component, inject, signal, DestroyRef, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ProductService, UpdateProductRequest } from '../../services/product/product';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { finalize } from 'rxjs';


@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-product-update',
  templateUrl: './product-update.html',
  changeDetection: ChangeDetectionStrategy.OnPush 
})
export class ProductUpdate implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  private productId = 0;

  protected readonly submitting = signal<boolean>(false);
  protected readonly loading = signal<boolean>(true);
  protected readonly loadError = signal<string | null>(null);
  protected readonly error = signal<string | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required,  Validators.pattern(/\S/), Validators.maxLength(100)]],
    price: this.fb.control<number | null>(null, [Validators.required, Validators.min(0)])
  })

  ngOnInit(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(this.productId) || this.productId <= 0) {
      this.loading.set(false);
      this.loadError.set("รหัสสินค้าไม่ถูกต้อง");
      return;
    }

    this.productService.getProduct(this.productId)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.loading.set(false);
      })
    )
    .subscribe({
      next: (product) => {
        this.form.patchValue({
          name: product.name,
          price: product.price
        })
      },

      error: (err:HttpErrorResponse) => {
        this.loadError.set(
          err.status === 404 ? 'ไม่พบสินค้า' : 'โหลดข้อมูลสินค้าไม่สำเร็จ กรุณาลองใหม่อีกครั้ง'
        )
      }
    })
  }

  protected onSubmit() {
    if (this.submitting()) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const body = this.buildChanges();

    if (Object.keys(body).length === 0) {
      this.router.navigate(['/products']);
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.productService.updateProduct(this.productId, body)
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
          this.error.set(this.toMessage(err));
        } 
      })
  }

  private buildChanges(): UpdateProductRequest {
    const { name, price } = this.form.controls;
    const body: UpdateProductRequest = {}

    if (name.dirty) {
      body.name = name.value.trim();
    }
    if (price.dirty && price.value !== null) {
      body.price = price.value;
    }
    
    return body;
  }

  private toMessage(error : HttpErrorResponse): string {
    if (error.status === 400 || error.status === 422) {
      return 'ข้อมูลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง';
    }
    if (error.status === 404) {
      return 'ไม่พบสินค้านี้ อาจถูกลบไปแล้ว';
    }
    if (error.status === 409) {
      return 'ข้อมูลซ้ำกับสินค้าอื่น';
    }
    if (error.status === 0) {
      return 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้';
    }
    return 'บันทึกไม่สำเร็จ กรุณาลองใหม่อีกครั้ง';
  }
}

import { ChangeDetectionStrategy, Component, inject, OnInit, signal, DestroyRef } from '@angular/core';
import { ProductService } from '../../services/product/product';
import { Product } from '../../model/Product';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [RouterLink],
  selector: 'app-products',
  templateUrl: './products.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Products implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly loadError = signal<string | null>(null);

  protected readonly deleting = signal<boolean>(false);
  protected readonly deleteError = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchProducts();
  }

  private fetchProducts(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.loadError.set(null);

    this.productService.getProducts()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: (data) => {
          this.products.set(data);
        },
        error: (err) => {
          this.loadError.set(`Fetch data error : ${err.error?.message ?? err.message}`);
        }
      })
  }

  protected deleteProduct(id: number) {
    if (this.deleting()) {
      return;
    }

    this.deleting.set(true);
    this.deleteError.set(null);

    this.productService.deleteProduct(id)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.deleting.set(false);
      })
    )
    .subscribe({
      next: () => {
        this.products.update(items => items.filter(product => product.id !== id))
      },
      error: (err: HttpErrorResponse) => {
        this.deleteError.set(err.error?.message ?? 'เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง')
      }
    })
  }

}

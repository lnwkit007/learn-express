import { ChangeDetectionStrategy, Component, inject, OnInit, signal, } from '@angular/core';
import { ProductService } from '../../services/product/product';
import { Product } from '../../model/Product';
import { finalize } from 'rxjs';
import { DestroyRef } from '@angular/core';
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
  protected readonly error = signal<string | null>(null);

  protected readonly deletting = signal<boolean>(false);
  protected readonly deletError = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchProducts();
  }

  private fetchProducts(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

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
          this.error.set(`Fetch data error : ${err}`);
        }
      })
  }

  protected DeleteProduct(id: number) {
    if (this.deletting()) {
      return;
    }

    this.deletting.set(true);
    this.deletError.set(null);

    this.productService.deleteProduct(id)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.deletting.set(false);
      })
    )
    .subscribe({
      next: () => {
        this.fetchProducts()
      },
      error: (err: HttpErrorResponse) => {
        this.deletError.set(err.error.message)
      }
    })
  }

}

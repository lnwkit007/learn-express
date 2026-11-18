import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { ProductService } from '../../services/product/product';
import { Product as ProductModel } from '../../model/Product';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';

@Component({
  imports: [],
  selector: 'app-product',
  templateUrl: './product.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Product implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly route = inject(ActivatedRoute);

  protected readonly product = signal<ProductModel | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.fetchProduct(id);
    }
  }

  private fetchProduct(id: number): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.productService.getProduct(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: (data) => {
          this.product.set(data);
        },
        error: (err) => {
          this.error.set(`Fetch data error : ${err}`);
        }
      })
  }
}

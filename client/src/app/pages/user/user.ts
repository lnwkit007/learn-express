import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { UserServices } from '../../services/user/user';
import { User as UserModel } from '../../interfaces/User';
import { finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
  imports: [],
  selector: 'app-user',
  templateUrl: './user.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class User implements OnInit {
  private readonly userServices = inject(UserServices);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly user = signal<UserModel | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {``
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.fetchUser(id);
    }
  }

  fetchUser(id: number): void {
    this.loading.set(true);

    this.userServices.getUser(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        })
      ).subscribe({
        next: (data) => {
          this.user.set(data);
        },
        error: (err) => {
          this.error.set(`Fetch data error : ${err}`);
        }
      })
  }
}
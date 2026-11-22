import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { UserService } from '../../services/user/user';
import { User as UserModel } from '../../model/User';
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
  private readonly userService = inject(UserService);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly user = signal<UserModel | null>(null);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(id) || id <= 0) {
      this.error.set('รหัสผู้ใช้ไม่ถูกต้อง');
      return;
    }
    
    this.fetchUser(id);
  }

  private fetchUser(id: number): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.userService.getUser(id)
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
          this.error.set(`Fetch data error : ${err.error?.message ?? err.message}`);
        }
      })
  }
}
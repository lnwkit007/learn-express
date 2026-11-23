import { Component, inject, signal, OnInit, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from '../../services/user/user';
import { User } from '../../model/User';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-users',
  templateUrl: './users.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Users implements OnInit {
  private readonly userService = inject(UserService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  protected readonly deleting = signal<boolean>(false);
  protected readonly deleteError = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.userService.getUsers()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        })
      ).subscribe({
        next: (data) => {
          this.users.set(data)
        },
        error: (err) => {
          this.error.set(`Fetch data error : ${err.error?.message ?? err.message}`);
        }
      })
  }

  protected deleteUser(id: number): void {
    if (this.deleting()) {
      return;
    }

    this.deleting.set(true);
    this.deleteError.set(null);

    this.userService.deleteUser(id)
    .pipe(
      takeUntilDestroyed(this.destroyRef),
      finalize(() => {
        this.deleting.set(false);
      })
    ).subscribe({
      next: () => {
        this.users.update(items => items.filter(user => user.id !== id))
      },
      error: (err) => {
        this.deleteError.set(err.error?.message ?? err.message)
      }
    })
  }
}

import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { UserServices } from '../../services/user/user';
import { User } from '../../interfaces/User';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  imports: [],
  selector: 'app-users',
  templateUrl: './users.html',
})
export class Users implements OnInit {
  private readonly userServices = inject(UserServices);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly users = signal<User[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    if (this.loading()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.userServices.getUsers()
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
          this.error.set(`Fetch data error : ${err}`);
        }
      })
  }
}

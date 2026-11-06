import { Component, inject, signal, OnInit } from '@angular/core';
import { UserServices } from '../../services/user/user';
import { User } from '../../interfaces/User';
import { finalize } from 'rxjs';

@Component({
  imports: [],
  selector: 'app-users',
  templateUrl: './users.html',
})
export class Users implements OnInit {
  private userServices = inject(UserServices);
  users = signal<User[]>([]);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.loading.set(true);

    this.userServices.getUsers()
    .pipe(
      finalize(() => {
        this.loading.set(false);
      })
    ).subscribe({
      next: (data) => {
        this.users.set(data)
      },
      error: (err) => {
        console.log("Fetch data error : ", err);
      }
    })
  }
}

import { Component, inject, signal, OnInit } from '@angular/core';
import { UserServices } from '../../services/user/user';
import { User as UserModel } from '../../interfaces/User';
import { finalize } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  imports: [],
  selector: 'app-user',
  templateUrl: './user.html',
})
export class User implements OnInit {
  private userServices = inject(UserServices);
  private activatedRoute = inject(ActivatedRoute);
  user = signal<UserModel | null>(null);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));

    if (id) {
      this.fetchUser(id);
    } 
  }

  fetchUser(id: number): void {
    this.loading.set(true);

    this.userServices.getUser(id)
    .pipe(
      finalize(() => {
        this.loading.set(false);
      })
    ).subscribe({
      next: (data) => {
        this.user.set(data);
      },
      error: (err) => {
        console.log("Fetch data error : ", err);
      }
    })
  }
}
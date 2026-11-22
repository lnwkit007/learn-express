import { Component, inject, signal, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { UserService, CreateUserRequest } from '../../services/user/user';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-user-create',
  templateUrl: './user-create.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCreate {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  protected readonly submitting = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  protected formCreateUser = this.fb.nonNullable.group({
    fname: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    lname: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    username: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.pattern(/\S/), Validators.email]]
  })

  protected onSubmit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.formCreateUser.invalid) {
      this.formCreateUser.markAllAsTouched();
      return;
    }

    const body = this.buildChanges();

    this.submitting.set(true);
    this.error.set(null);

    this.userService.createUser(body)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.submitting.set(false);
        })
      ).subscribe({
        next: () => {
          this.router.navigate(["/users"]);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.message ?? 'เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง')
        }
      })
  }

  private buildChanges(): CreateUserRequest {
    const { fname, lname, username, email } = this.formCreateUser.controls;
    const body: CreateUserRequest = {
      fname: fname.value.trim(),
      lname: lname.value.trim(),
      username: username.value.trim(),
      email: email.value.trim(),
    }

    return body;
  }
}

import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { UpdateUserRequest, UserService } from '../../services/user/user';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-user-update',
  templateUrl: './user-update.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserUpdate implements OnInit {
  private readonly userService = inject(UserService);
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  private userId = 0;

  protected readonly submitting = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);
  protected readonly loading = signal<boolean>(true);
  protected readonly loadError = signal<string | null>(null);

  protected readonly formUpdateUser = this.fb.nonNullable.group({
    fname: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    lname: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    username: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(100)]],
    email: ['', [Validators.required, Validators.pattern(/\S/), Validators.email]]
  });

  ngOnInit(): void {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isInteger(this.userId) || this.userId <= 0) {
      this.loading.set(false);
      this.loadError.set("รหัสผู้ใช้ไม่ถูกต้อง");
      return;
    }

    this.userService.getUser(this.userId)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.loading.set(false);
        })
      )
      .subscribe({
        next: (data) => {
          this.formUpdateUser.patchValue({
            fname: data.fname,
            lname: data.lname,
            username: data.username,
            email: data.email
          })
        },
        error: (err: HttpErrorResponse) => {
          this.loadError.set(err.error?.message ?? 'เกิดข้อผิดพลาดกรุณาลองใหม่อีกครั้ง');
        }
      })
  }

  protected onSubmit(): void {
    if (this.submitting()) {
      return;
    }

    if (this.formUpdateUser.invalid) {
      this.formUpdateUser.markAllAsTouched();
      return;
    }

    const body = this.buildChanges();

    if (Object.keys(body).length === 0) {
      this.router.navigate(['/users']);
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.userService.updateUser(this.userId, body)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => {
          this.submitting.set(false);
        })
      ).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(err.error?.message);
        }
      })
  }

  private buildChanges(): UpdateUserRequest {
    const { fname, lname, username, email } = this.formUpdateUser.controls;
    const body: UpdateUserRequest = {}

    if (fname.dirty) {
      body.fname = fname.value.trim();
    }
    if (lname.dirty) {
      body.lname = lname.value.trim();
    }
    if (username.dirty) {
      body.username = username.value.trim();
    }
    if (email.dirty) {
      body.email = email.value.trim();
    }

    return body
  }
}

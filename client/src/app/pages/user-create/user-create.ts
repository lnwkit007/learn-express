import { Component, inject, signal, DestroyRef, ChangeDetectionStrategy } from '@angular/core';
import { UserServices } from '../../services/user/user';
import { FormBuilder, Validator, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  selector: 'app-user-create',
  templateUrl: './user-create.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCreate {
  private readonly userService = inject(UserServices);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly submitting = signal<boolean>(false);
  protected readonly error = signal<string | null>(null);

  protected form = []

  protected onSubmit():void {
    if (this.submitting()) {
      return;
    }


  }
}

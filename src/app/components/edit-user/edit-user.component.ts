import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { Observable, EMPTY, Subscription, combineLatest, map, iif, of, last, switchMap, first } from 'rxjs';
import { loginRequest, loginFailure } from '../../store/auth/auth.actions';
import { selectLoginToken, selectLoginUser } from '../../store/auth/auth.selectors';
import { UserModel } from '../../models/user.model';
import { UploadService } from '../../services/upload.service';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../../../environment';
import { v6 as uuidV6, stringify as uuidStringify } from 'uuid';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, StoreModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private formBuilder: FormBuilder,
    private uploadService: UploadService,
    private userService: UserService,
  ) {

  }

  user$: Observable<UserModel | null> = EMPTY;
  token$: Observable<string | null> = EMPTY;
  file: File | null = null;

  ngOnInit(): void {
    this.store.subscribe();
    this.user$ = this.store.select(selectLoginUser);
    this.token$ = this.store.select(selectLoginToken);
  }

  public get userPictureLocation() : string {
    return this.file ? this.file.name : environment.defaultProfilePicture;
  }

  editUserForm = this.formBuilder.group({
    displayname: new FormControl(),
    about: new FormControl(),
  });

  onFileSelected(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
    console.log(this.file);
    
  }

  async onSubmit(): Promise<void> {
    if (!this.editUserForm.valid) {
      throw new Error('Invalid form.');
    }

    combineLatest([this.token$, this.user$]).pipe(
      switchMap(([token, user]) => this.userService.editUser({
          displayname: this.editUserForm.value.displayname ?? user?.displayname,
          about: this.editUserForm.value.about ?? user?.about,
        }, this.file, token!)
      ),
      first()
    ).subscribe();
  }
}

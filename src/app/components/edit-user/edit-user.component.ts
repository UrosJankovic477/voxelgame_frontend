import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { Observable, EMPTY } from 'rxjs';
import { loginRequest, loginFailure } from '../../store/auth/auth.actions';
import { selectLoginToken, selectLoginUser } from '../../store/auth/auth.selectors';
import { User } from '../../models/user.model';
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

  user$: Observable<User | null> = EMPTY;
  token$: Observable<string | null> = EMPTY;
  user: User | null = null;
  token: string | null = null;
  file: File | null = null;

  ngOnInit(): void {
    this.store.subscribe();
    this.user$ = this.store.select(selectLoginUser);
    this.user$.subscribe((user) => {
      this.user = user;
    });
    this.token$ = this.store.select(selectLoginToken);
    this.token$.subscribe((token) => {
      this.token = token;
    });
  }

  public get userPictureLocation() : string {
    return this.file ? this.file.name : environment.defaultProfilePicture;
  }

  editUserForm = this.formBuilder.group({
    displayname: new FormControl(this.user?.displayname, [
    ]),
    about: new FormControl(this.user?.about, [
    ]),
  });

  onFileSelected(event: Event) {
    this.file = (event.target as HTMLInputElement).files![0];
    console.log(this.file);
    
  }

  onSubmit(): void {
    let filename: string | null = null;
    if (this.file) {
      console.log("profile pic changed");
      this.file.bytes().then(bytes => {
        const uploadFile = new File([bytes], uuidV6())
        this.uploadService.upload(uploadFile);
        filename = uploadFile.name;
      })
    }

    if (this.editUserForm.valid) {
      this.userService.editUser({
        about: this.editUserForm.value.about ?? this.user?.about,
        displayname: this.editUserForm.value.displayname ?? this.user?.displayname,
        profilePictureLocation: filename ?? this.user?.pictureLocation,
      }, this.token!).subscribe();
    }
    
  }
}

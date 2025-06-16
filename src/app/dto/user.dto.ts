export class UserDto {
    username?: string;
    displayname?: string;
    about?: string;
    pictureBytes?: Uint8Array;
    profilePictureLocation?: string;
    password?: string;
    confirmPassword?: string;
}
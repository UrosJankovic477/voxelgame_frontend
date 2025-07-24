export interface NotificationModel {
    id: number
    posted: Date;
    read: boolean;
    voxelBuildUuid: string | null;
    commentUuid: string | null;
    posterUsername: string | null;
    posterDisplayname: string | null;
    profilePictureLocation: string | null;
    commentParentUuid: string | null;
}
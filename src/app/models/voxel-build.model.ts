export interface VoxelBuildModel {
    uuid?: `${string}-${string}-${string}-${string}-${string}`;
    title?: string;
    description?: string;
    previewPictureLocation?: string;
    posted?: Date;
    user?: {
        username: string;
        displayname: string;
    };
}
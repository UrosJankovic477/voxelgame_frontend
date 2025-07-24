export interface CommentModel {
    id: number;
    content: string,
    comment_voxelBuildUuid: string;
    username: string | null,
    displayname: string | null,
    profilePictureLocation: string | null;
    op: string | null;
};
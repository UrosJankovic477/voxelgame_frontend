export interface CommentModel {
    uuid: string;
    content: string,
    comment_voxelBuildUuid: string;
    comment_parentUuid: string;
    username: string | null,
    displayname: string | null,
    profilePictureLocation: string | null;
    op: string | null;
    count: number;
};
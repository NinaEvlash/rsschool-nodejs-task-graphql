export interface CreateUserDto {
  name: string;
  balance: number;
}
export interface CreatePostDto {
  title: string;
  content: string;
  authorId: string;
}
export interface CreateProfileDto {
  userId: string;
  memberTypeId: string;
  isMale: boolean;
  yearOfBirth: number;
}

export interface ChangeUserDto {
  name?: string;
  balance?: number;
}

export interface ChangePostDto {
  title?: string;
  content?: string;
}

export interface ChangeProfileDto {
  memberTypeId?: string;
  isMale?: boolean;
  yearOfBirth?: number;
}

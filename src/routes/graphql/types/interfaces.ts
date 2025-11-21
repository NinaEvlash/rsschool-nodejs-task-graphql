export interface CreateUserArgs {
  email: string;
  name: string;
  balance: number;
}

export interface UpdateUserArgs {
  id: string;
  email: string;
  name: string;
}

export interface CreatePostArgs {
  title: string;
  content: string;
  authorId: string;
}

export interface UpdatePostArgs {
  id: string;
  title: string;
  content: string;
}

/** Shapes exchanged between the engagement Route Handlers and the article UI. */

export type CommentView = {
  id: string;
  body: string;
  createdAt: string;
  author: { name: string; avatarUrl: string | null };
  /** True when the current reader wrote it (computed on the server). */
  isOwn: boolean;
};

export type EngagementPayload = {
  likes: number;
  liked: boolean;
  comments: CommentView[];
  commentCount: number;
  viewer: { canModerate: boolean } | null;
};

export type LikePayload = { likes: number; liked: boolean };

export type ApiError = { error: string };

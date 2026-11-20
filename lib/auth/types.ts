export type EditorialRole = 'admin' | 'editor';

export interface EditorialUser {
  id: string;
  email: string;
  role: EditorialRole;
}

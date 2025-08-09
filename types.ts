export type Role = 'user' | 'model';

export interface Source {
  uri: string;
  title: string;
}

export interface Message {
  role: Role;
  text: string;
  sources?: Source[];
}

export interface Note {
  id: string;
  title: string;
  createdAt: Date;
}
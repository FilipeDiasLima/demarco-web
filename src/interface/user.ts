export interface UserProps {
  _id: string;
  fullname: string;
  email: string;
  cpf: string;
  birthdate?: string;
  role?: "user" | "admin";
  password?: string;
  isActive?: boolean;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

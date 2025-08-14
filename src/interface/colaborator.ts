export interface ColaboratorProps {
  _id: string;
  fullname: string;
  companyId: string;
  cpf: string;
  birthdate: string;
  role: string;
  status: "active" | "inactive";
  createdAt?: Date | null;
  updatedAt?: Date | null;
  deletedAt?: Date | null;
}

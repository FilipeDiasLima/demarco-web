import type { ColaboratorProps } from "@/interface/colaborator";

interface CidProps {
  code: string;
  description: string;
}

export interface MedicalCertificateProps {
  _id: string;
  collaboratorId: ColaboratorProps;
  certificateDateTime: Date;
  companyId: string;
  leaveDays: number;
  cid: CidProps;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ColaboratorProps } from "@/interface/colaborator";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Eye, Trash2, UserCheck, Users, UserX } from "lucide-react";

interface CollaboratorCardProps {
  colaborator: ColaboratorProps;
  isLoading?: boolean;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CollaboratorCard({
  colaborator,
  isLoading = false,
  onToggleStatus,
  onDelete,
}: CollaboratorCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-success/10 text-success border-success/20">
            Ativo
          </Badge>
        );
      case "inactive":
        return (
          <Badge variant="outline" className="text-muted-foreground">
            Inativo
          </Badge>
        );
      default:
        return <Badge variant="outline">Desconhecido</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <UserCheck className="w-4 h-4 text-success" />;
      case "inactive":
        return <UserX className="w-4 h-4 text-warning" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  return (
    <Card className="shadow-soft hover:shadow-medical transition-smooth">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              {getStatusIcon(colaborator.status)}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {colaborator.fullname}
              </h3>
              <p className="text-sm text-muted-foreground">
                {colaborator.role}
              </p>
            </div>
          </div>
          {getStatusBadge(colaborator.status)}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">CPF:</span>
            <span className="font-mono">{colaborator.cpf}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Nascimento:</span>
            <span>{dayjs(colaborator.birthdate).format("DD/MM/YYYY")}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={() => onToggleStatus(colaborator._id)}
            disabled={isLoading}
            className={cn(
              "flex-1",
              colaborator.status === "active"
                ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                : "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
            )}
          >
            <Eye className="w-4 h-4 mr-2" />
            {colaborator.status === "active" ? "Desativar" : "Ativar"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(colaborator._id)}
            disabled={isLoading}
            className="hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

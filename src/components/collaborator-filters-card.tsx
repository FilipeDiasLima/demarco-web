import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CollaboratorFiltersCardProps {
  searchTerm: string;
  selectedStatus: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (status: string) => void;
}

export function CollaboratorFiltersCard({
  searchTerm,
  selectedStatus,
  onSearchChange,
  onStatusChange,
}: CollaboratorFiltersCardProps) {
  const statusOptions = [
    { value: "todos", label: "Todos" },
    { value: "active", label: "Ativos" },
    { value: "inactive", label: "Inativos" },
  ];

  return (
    <Card className="shadow-soft">
      <CardHeader>
        <CardTitle>Filtros</CardTitle>
        <CardDescription>
          Busque e filtre colaboradores por nome, CPF ou status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar por nome ou CPF..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 transition-smooth focus:shadow-soft"
            />
          </div>

          <div className="flex gap-2">
            {statusOptions.map((status) => (
              <Button
                key={status.value}
                variant={
                  selectedStatus === status.value ? "default" : "outline"
                }
                size="sm"
                onClick={() => onStatusChange(status.value)}
                className="transition-smooth"
              >
                {status.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

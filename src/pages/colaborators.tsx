import { CollaboratorCard } from "@/components/collaborator-card";
import { CollaboratorFiltersCard } from "@/components/collaborator-filters-card";
import CreateColaborator from "@/components/create-colaborator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { usePageTitle } from "@/hooks/use-page-title";
import type { ColaboratorProps } from "@/interface/colaborator";
import { api } from "@/services/api";
import { Loader, Plus, UserCheck, Users, UserX } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

const Colaborators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("todos");

  const { handleError } = useErrorHandler();
  const [isPending, startTransition] = useTransition();
  const [isColaboratorPending, startColaboratorTransition] = useTransition();
  const [colaborators, setColaborators] = useState<ColaboratorProps[]>([]);

  const filteredColaborators = colaborators.filter((colaborador) => {
    const matchesSearch =
      colaborador.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      colaborador.cpf.includes(searchTerm);
    const matchesStatus =
      selectedStatus === "todos" || colaborador.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleCollaboratorStatus = (id: string) => {
    startColaboratorTransition(async () => {
      try {
        const colaborator = colaborators.find((c) => c._id === id);

        if (!colaborator) return;

        const newStatus =
          colaborator.status === "active" ? "inactive" : "active";

        await api.put(`/colaborators/toggle-status/${id}`);

        setColaborators((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
        );

        toast.success(
          `Colaborador ${newStatus === "active" ? "ativado" : "desativado"}`
        );
      } catch (error) {
        handleError(error);
      }
    });
  };

  const handleDelete = (id: string) => {
    startColaboratorTransition(async () => {
      try {
        const colaborator = colaborators.find((c) => c._id === id);

        if (!colaborator) return;

        await api.delete(`/colaborators/${id}`);

        setColaborators((prev) => prev.filter((c) => c._id !== id));
        toast.success("Colaborador excluído com sucesso!");
      } catch (error) {
        handleError(error);
      }
    });
  };

  usePageTitle({ title: "Colaboradores" });

  useEffect(() => {
    const fetchColaborators = () => {
      startTransition(async () => {
        try {
          const response = await api.get("/colaborators/all");
          setColaborators(response.data.colaborators);
        } catch (error) {
          handleError(error);
        }
      });
    };

    fetchColaborators();
  }, []);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Colaboradores</h1>
          <p className="text-muted-foreground">
            Gerencie os colaboradores da empresa
          </p>
        </div>

        <CreateColaborator setColaborators={setColaborators}>
          <Button className="gradient-primary shadow-soft hover:shadow-glow transition-smooth">
            <Plus className="w-4 h-4 mr-2" />
            Novo Colaborador
          </Button>
        </CreateColaborator>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ativos
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {colaborators.filter((c) => c.status === "active").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                <UserX className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Afastados
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {colaborators.filter((c) => c.status === "inactive").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {colaborators.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <CollaboratorFiltersCard
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        onSearchChange={setSearchTerm}
        onStatusChange={setSelectedStatus}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredColaborators.map((colaborador) => (
          <CollaboratorCard
            key={colaborador._id}
            colaborator={colaborador}
            isLoading={isColaboratorPending}
            onToggleStatus={toggleCollaboratorStatus}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {filteredColaborators.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="p-12 text-center">
            <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum colaborador encontrado
            </h3>
            <p className="text-muted-foreground">
              Ajuste os filtros ou cadastre um novo colaborador
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Colaborators;

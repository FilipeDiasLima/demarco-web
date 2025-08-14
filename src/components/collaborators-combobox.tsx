"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useErrorHandler } from "@/hooks/use-error-handler";
import type { ColaboratorProps } from "@/interface/colaborator";
import { cn } from "@/lib/utils";
import { api } from "@/services/api";
import { Check, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

interface CollaboratorComboboxProps {
  open: boolean;
  collaboratorId?: string;
  setOpen: (isOpen: boolean) => void;
  setSelectedCollaboratorId: (collaboratorId: string | undefined) => void;
}

export function CollaboratorCombobox({
  open,
  collaboratorId,
  setOpen,
  setSelectedCollaboratorId,
}: CollaboratorComboboxProps) {
  const { handleError } = useErrorHandler();
  const [collaborators, setCollaborators] = useState<ColaboratorProps[]>([]);

  async function fetchCollaborators() {
    try {
      const response = await api.get("/colaborators/all");
      setCollaborators(response.data.colaborators);
    } catch (error) {
      handleError(error);
    }
  }

  useEffect(() => {
    fetchCollaborators();
  }, []);

  const handleCollaboratorSelect = (selectedCollaboratorId: string) => {
    if (collaboratorId === selectedCollaboratorId) {
      // Se o mesmo colaborador for clicado, desmarca
      setSelectedCollaboratorId(undefined);
    } else {
      // Seleciona o novo colaborador
      setSelectedCollaboratorId(selectedCollaboratorId);
    }
    setOpen(false); // Fecha o popover após a seleção
  };

  const getDisplayText = () => {
    if (!collaboratorId) {
      return "Selecione um colaborador";
    } else {
      const collaborator = collaborators.find((t) => t._id === collaboratorId);
      return collaborator?.fullname || "Colaborador selecionado";
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="justify-between"
          >
            {getDisplayText()}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Buscar colaborador..." />
          <CommandEmpty>Nenhum colaborador encontrado.</CommandEmpty>
          <CommandList>
            <CommandGroup>
              {collaborators.map((collaborator) => (
                <CommandItem
                  key={collaborator._id}
                  value={collaborator.fullname}
                  onSelect={() => handleCollaboratorSelect(collaborator._id)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      collaboratorId === collaborator._id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {collaborator.fullname}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

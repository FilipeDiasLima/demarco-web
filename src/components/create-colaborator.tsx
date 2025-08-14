import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useErrorHandler } from "@/hooks/use-error-handler";
import type { ColaboratorProps } from "@/interface/colaborator";
import { api } from "@/services/api";
import { cpfMask, unmaskCPF } from "@/utils/cpf-mask";
import { isValidCPF } from "@/utils/cpf-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

interface CreateColaboratorProps {
  children: React.ReactNode;
  setColaborators: (
    colaborators:
      | ColaboratorProps[]
      | ((prev: ColaboratorProps[]) => ColaboratorProps[])
  ) => void;
}

const formSchema = z.object({
  fullname: z
    .string({
      error: "Nome completo é obrigatório.",
    })
    .max(60, { message: "Nome completo deve ter no máximo 60 caracteres." }),
  role: z.string(),
  birthdate: z
    .string({
      error: "Data de nascimento é obrigatória.",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "Data de nascimento deve estar no formato YYYY-MM-DD.",
    }),
  cpf: z
    .string({
      error: "CPF é obrigatório.",
    })
    .refine((value) => isValidCPF(unmaskCPF(value)), {
      message: "CPF inválido",
    }),
});

type FormData = z.infer<typeof formSchema>;

const CreateColaborator = ({
  children,
  setColaborators,
}: CreateColaboratorProps) => {
  const { handleError } = useErrorHandler();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthdate: "",
      cpf: "",
      fullname: "",
      role: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    startTransition(async () => {
      try {
        const response = await api.post("/colaborators", {
          fullname: data.fullname,
          role: data.role,
          birthdate: dayjs(data.birthdate).format("YYYY-MM-DD"),
          cpf: unmaskCPF(data.cpf),
        });
        setColaborators((prev: ColaboratorProps[]) => [
          ...prev,
          response.data.colaborator as ColaboratorProps,
        ]);
        onClose();
      } catch (error) {
        handleError(error);
      }
    });
  };

  const onClose = () => {
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar um colaborador</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            className="flex flex-col space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="fullname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome completo</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Nome completo" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="CPF"
                      value={cpfMask(field.value)}
                      onChange={field.onChange}
                      maxLength={14}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cargo</FormLabel>
                  <FormControl>
                    <Input placeholder="Cargo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthdate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      placeholder="Data de Nascimento"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateColaborator;

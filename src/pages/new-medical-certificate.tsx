import { CidCombobox } from "@/components/cid-combobox";
import { CollaboratorCombobox } from "@/components/collaborators-combobox";
import { DatePicker } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { usePageTitle } from "@/hooks/use-page-title";
import { api } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { FileText, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  collaboratorId: z.string().min(1, "O colaborador é obrigatório"),
  certificateDateTime: z.date({
    error: "A data do atestado é obrigatória",
  }),
  hourStart: z.string().min(1, "A hora de início é obrigatória"),
  leaveDays: z.coerce
    .number({
      error: "A quantidade de dias é obrigatória",
    })
    .min(1, {
      error: "A quantidade de dias deve ser pelo menos 1",
    })
    .max(365, {
      error: "A quantidade de dias deve ser no máximo 365",
    }),
  cid: z.object({
    code: z.string().min(1, "O CID é obrigatório"),
    description: z.string().min(1, "A descrição do CID é obrigatória"),
  }),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const NewMedicalCertificate = () => {
  const [isPending, startTransition] = useTransition();

  const { handleError } = useErrorHandler();
  const [openCollaborator, setOpenCollaborator] = useState(false);
  const [openCid, setOpenCid] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      certificateDateTime: new Date(),
      cid: {
        code: "",
        description: "",
      },
      hourStart: "",
      collaboratorId: "",
      leaveDays: 1,
      notes: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        const hour = data.hourStart.split(":");
        await api.post("/medical-certificates", {
          collaboratorId: data.collaboratorId,
          certificateDateTime: dayjs(data.certificateDateTime)
            .set("hour", Number(hour[0]))
            .toISOString(),
          leaveDays: data.leaveDays,
          cid: {
            code: data.cid.code,
            description: data.cid.description,
          },
          notes: data.notes,
        });
        form.reset();
      } catch (error) {
        handleError(error);
      }
    });
  };

  usePageTitle({ title: "Novo Atestado" });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Novo Atestado</h1>
        <p className="text-muted-foreground">
          Lance um novo atestado médico no sistema
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Dados do Atestado
            </CardTitle>
            <CardDescription>
              Preencha as informações do atestado médico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="collaboratorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Colaborador</FormLabel>
                      <CollaboratorCombobox
                        open={openCollaborator}
                        setOpen={setOpenCollaborator}
                        collaboratorId={field.value}
                        setSelectedCollaboratorId={field.onChange}
                      />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CID</FormLabel>
                      <CidCombobox
                        open={openCid}
                        setOpen={setOpenCid}
                        selectedCid={field.value}
                        setSelectedCid={field.onChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="certificateDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data e Hora do Atestado</FormLabel>
                        <FormControl>
                          <DatePicker
                            date={
                              field.value ? new Date(field.value) : undefined
                            }
                            setDate={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hourStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora de Início</FormLabel>
                        <FormControl>
                          <Input
                            type="time"
                            step="1"
                            defaultValue="10:30:00"
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="leaveDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade de Dias</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="1"
                          max="365"
                          placeholder="Ex: 3"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="gradient-primary shadow-soft hover:shadow-glow transition-smooth flex-1"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar Atestado
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NewMedicalCertificate;

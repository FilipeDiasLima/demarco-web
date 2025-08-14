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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useErrorHandler } from "@/hooks/use-error-handler";
import { usePageTitle } from "@/hooks/use-page-title";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Loader2, Shield, Users } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string({
    error: "A senha é obrigatória",
  }),
});

type FormData = z.infer<typeof formSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { handleError } = useErrorHandler();
  const { signIn } = useAuth();
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (data: FormData) => {
    startTransition(async () => {
      try {
        await signIn(data);
        toast.success("Login realizado com sucesso!");
        navigate("/dashboard");
      } catch (error) {
        handleError(error);
      }
    });
  };

  usePageTitle({ title: "Login" });

  return (
    <div className="min-h-screen flex items-center justify-center gradient-hero p-4 w-full">
      <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="text-center lg:text-left text-white space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
              Sistema de
              <span className="block text-white/90">Gestão de Atestados</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed">
              Plataforma moderna e intuitiva para gestão completa de atestados
              médicos. Conecte colaboradores, médicos e gestores em um ambiente
              seguro e eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white">Gestão Simples</h3>
              <p className="text-sm text-white/70">
                Interface intuitiva e fácil de usar
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white">Seguro</h3>
              <p className="text-sm text-white/70">
                Dados protegidos e confidenciais
              </p>
            </div>

            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-white">Cuidado</h3>
              <p className="text-sm text-white/70">
                Foco no bem-estar dos colaboradores
              </p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card className="shadow-large animate-fade-in bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold text-center">
              Acesse sua conta
            </CardTitle>
            <CardDescription className="text-center">
              Digite suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-6 gradient-primary shadow-soft hover:shadow-glow transition-smooth"
                  disabled={isPending}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isPending ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <Button variant="ghost" className="text-sm text-muted-foreground">
                Esqueceu sua senha?
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

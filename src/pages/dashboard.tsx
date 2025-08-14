import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePageTitle } from "@/hooks/use-page-title";
import {
  AlertCircle,
  Clock,
  FileText,
  Plus,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      title: "Colaboradores Ativos",
      value: "142",
      description: "Total de funcionários cadastrados",
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Atestados Ativos",
      value: "8",
      description: "Funcionários em afastamento",
      icon: UserCheck,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Novos esta semana",
      value: "12",
      description: "Atestados lançados nos últimos 7 dias",
      icon: FileText,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Vencendo hoje",
      value: "3",
      description: "Atestados com retorno previsto",
      icon: Clock,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
  ];

  const recentActivities = [
    {
      id: 1,
      description: "Novo atestado cadastrado para Maria Silva",
      time: "Há 2 horas",
      type: "new",
    },
    {
      id: 2,
      description: "João Santos retornou do afastamento",
      time: "Há 4 horas",
      type: "return",
    },
    {
      id: 3,
      description: "Atestado de Ana Costa vence amanhã",
      time: "Há 6 horas",
      type: "alert",
    },
  ];

  usePageTitle({ title: "Dashboard" });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Visão geral do sistema de gestão de atestados
          </p>
        </div>

        <Button
          onClick={() => navigate("/dashboard/medical-certificate/new")}
          className="gradient-primary shadow-soft hover:shadow-glow transition-smooth"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Atestado
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className="shadow-soft hover:shadow-medical transition-smooth"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div
                className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Ações Rápidas
            </CardTitle>
            <CardDescription>
              Acesso rápido às principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start hover:bg-primary/5"
              onClick={() => navigate("/dashboard/colaborators")}
            >
              <Users className="w-4 h-4 mr-2" />
              Gerenciar Colaboradores
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start hover:bg-secondary/5"
              onClick={() => navigate("/dashboard/medical-certificate")}
            >
              <FileText className="w-4 h-4 mr-2" />
              Ver Todos Atestados
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start hover:bg-warning/5"
            >
              <Clock className="w-4 h-4 mr-2" />
              Retornos de Hoje
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2 shadow-soft">
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas movimentações no sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-smooth"
                >
                  <div className="w-2 h-2 rounded-full bg-primary mt-2 animate-pulse-soft"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                  {activity.type === "alert" && (
                    <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-1" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

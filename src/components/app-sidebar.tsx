import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import {
  FileText,
  Heart,
  LayoutDashboard,
  LogOut,
  Plus,
  Users,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Colaboradores",
    url: "/dashboard/colaborators",
    icon: Users,
  },
  {
    title: "Lançar Atestado",
    url: "/dashboard/medical-certificate/new",
    icon: Plus,
  },
  {
    title: "Atestados",
    url: "/dashboard/medical-certificate",
    icon: FileText,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { state } = useSidebar();

  const location = useLocation();
  const collapsed = state === "collapsed";

  const { signOut } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarContent className="bg-sidebar">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && (
              <div>
                <h2 className="text-sm font-semibold text-sidebar-foreground">
                  Demarco
                </h2>
                <p className="text-xs text-sidebar-foreground/70">
                  Sistema de Atestados
                </p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/70">
            Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`transition-smooth ${
                      isActive(item.url)
                        ? "bg-sidebar-accent text-sidebar-primary font-medium shadow-soft"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                    }`}
                  >
                    <NavLink
                      to={item.url}
                      className="flex items-center space-x-3"
                    >
                      <item.icon className="w-5 h-5" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem
            className="flex items-center space-x-2 cursor-pointer"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            <p>Sair</p>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

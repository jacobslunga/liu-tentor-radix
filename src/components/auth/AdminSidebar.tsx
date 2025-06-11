import { Button } from "@/components/ui/button";
import { LogoIcon } from "@/components/LogoIcon";
import {
  UploadCloud,
  FolderOpen,
  Trash2,
  Menu,
  X,
  Home,
  LogOut,
} from "lucide-react";
import { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/supabase/supabaseClient";

interface AdminSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar: FC<AdminSidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const menuItems = [
    {
      path: "/admin/dashboard/add-exams",
      label: "Ladda upp tentor",
      icon: UploadCloud,
      description: "Lägg till nya tentor i systemet",
    },
    {
      path: "/admin/dashboard/review",
      label: "Hantera tentor",
      icon: FolderOpen,
      description: "Granska uppladdade tentor",
    },
    {
      path: "/admin/dashboard/remove-exams",
      label: "Ta bort tentor",
      icon: Trash2,
      description: "Radera tentor från systemet",
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-background/95 backdrop-blur-sm border-border/50"
        >
          {sidebarOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 z-50 w-64 h-full bg-card/95 backdrop-blur-sm border-r border-border/50 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border/30">
            <Link
              to="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
              onClick={() => setSidebarOpen(false)}
            >
              <LogoIcon className="w-8 h-8" />
              <div>
                <h1 className="font-logo text-lg text-foreground">
                  LiU Tentor
                </h1>
                <p className="text-xs text-muted-foreground">
                  Administratörspanel
                </p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <div className="mb-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Hantera tentor
              </p>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group
                      ${
                        active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "hover:bg-muted/50 text-foreground/70 hover:text-foreground"
                      }
                    `}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        active
                          ? "text-primary-foreground"
                          : "text-foreground/60 group-hover:text-foreground"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-medium ${
                          active ? "text-primary-foreground" : ""
                        }`}
                      >
                        {item.label}
                      </p>
                      <p
                        className={`text-xs truncate ${
                          active
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }`}
                      >
                        {item.description}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-border/30 pt-4">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">
                Allmänt
              </p>

              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-foreground/70 hover:text-foreground hover:bg-muted/50 group"
              >
                <Home className="h-5 w-5 text-foreground/60 group-hover:text-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Tillbaka till hem</p>
                  <p className="text-xs text-muted-foreground truncate">
                    Huvudsidan
                  </p>
                </div>
              </Link>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border/30">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start text-foreground/70 hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Logga ut
            </Button>

            <div className="mt-3 p-3 bg-muted/30 rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                Admin Dashboard
              </p>
              <p className="text-xs text-muted-foreground text-center mt-1">
                LiU Tentor v2.0
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;

import { Button } from "@/components/ui/button";
import { SquareLibrary } from "lucide-react";
import { FC } from "react";
import { Link, useLocation } from "react-router-dom";

const Leftbar: FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-[20%] flex flex-col items-start p-4 justify-start bg-foreground/5 h-screen fixed left-0 border-r">
      <h1 className="text-lg font-logo flex items-center gap-2 mb-6">
        <SquareLibrary className="text-primary w-6 h-6" />
        LiU Tentor
      </h1>
      <nav className="flex flex-col space-y-2 w-full">
        <Link to="/admin/dashboard/add-exams">
          <Button
            variant={
              isActive("/admin/dashboard/add-exams") ? "default" : "outline"
            }
            className="w-full justify-start"
          >
            Ladda upp tentor
          </Button>
        </Link>
        <Link to="/admin/dashboard/review">
          <Button
            variant={
              isActive("/admin/dashboard/review") ? "default" : "outline"
            }
            className="w-full justify-start"
          >
            Hantera tentor
          </Button>
        </Link>
        <Link to="/admin/dashboard/remove-exams">
          <Button
            variant={
              isActive("/admin/dashboard/remove-exams") ? "default" : "outline"
            }
            className="w-full justify-start"
          >
            Ta bort tentor
          </Button>
        </Link>
      </nav>
    </div>
  );
};

export default Leftbar;

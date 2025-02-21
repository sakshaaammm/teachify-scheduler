
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Calendar,
  Settings as SettingsIcon,
  Users,
  GraduationCap,
  BookOpen,
  LayoutGrid 
} from "lucide-react";

const Sidebar = () => {
  const location = useLocation();
  
  const links = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
    { href: "/settings", label: "Settings", icon: SettingsIcon },
    { href: "/teachers", label: "Teachers", icon: Users },
    { href: "/classes", label: "Classes", icon: GraduationCap },
    { href: "/subjects", label: "Subjects", icon: BookOpen },
    { href: "/generate", label: "Generate", icon: Calendar },
  ];

  return (
    <nav className="w-64 h-screen glass-card border-r border-white/20">
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-8 animate-glow">TimeTable Pro</h1>
        <div className="space-y-2">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200",
                  location.pathname === link.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                )}
              >
                <Icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;

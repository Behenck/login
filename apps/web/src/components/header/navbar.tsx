import { Home, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: "/", Icon: Home, label: "Home" },
    { to: "/settings", Icon: Settings, label: "Settings" },
  ];

  return (
    <nav>
      <div className="flex text-muted-foreground">
        {links.map(({ to, Icon, label }) => {
          const active =
              to === "/"
                ? pathname === "/"         // Home só ativa se for exatamente "/"
                : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center justify-center gap-2 text-sm p-4 hover:text-foreground
                ${active ? "text-foreground border-b-2 border-green-600" : ""}`}
            >
              <>
                <Icon className="w-4 h-4" />
                {label}
              </>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

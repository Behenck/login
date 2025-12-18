import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";

export function SignOutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    async function logout() {
      Cookies.remove("token");
      Cookies.remove("refreshToken");

      navigate("/auth/sign-in", { replace: true });
    }

    logout();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-3">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <span className="text-sm">Encerrando sessão...</span>
    </div>
  );
}

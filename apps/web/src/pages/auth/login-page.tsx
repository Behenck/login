import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/lib/axios";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";

const LoginSchema = z
  .object({
    email: z.email({ error: "Email inválido!" }),
    password: z.string().min(6, { error: "A senha deve ter no mínimo 6 caracteres!" }),
  })
  .required();

export type LoginType = z.infer<typeof LoginSchema>;

export function LoginPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  const {
    handleSubmit,
    register,
    resetField,
    formState: { errors },
  } = useForm<LoginType>({ resolver: zodResolver(LoginSchema) });

  const { ref: emailRef, ...emailRest } = register("email");
  const { ref: passwordRef, ...passwordRest } = register("password");

  const onsSubmit = async (data: LoginType) => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/sessions/password", data, { withCredentials: true });

      Cookies.set("token", response.data.accessToken);
      setSuccess(true);
    } catch (error) {
      setErrorMessage((error as any)?.response?.data?.message ?? "Erro ao entrar. Tente novamente.");
    } finally {
      setIsLoading(false);
      resetField("password");
    }
  };

  if (success) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-muted/30">
      <form
        className="w-full max-w-sm rounded-2xl border bg-background p-6 shadow-sm space-y-5"
        onSubmit={handleSubmit(onsSubmit)}
        noValidate
      >
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">Entrar</h1>
          <p className="text-sm text-muted-foreground">Acesse sua conta para continuar.</p>
        </div>

        {errorMessage ? (
          <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        ) : null}

        <div className="space-y-1.5">
          <label className="text-sm font-medium">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              inputMode="email"
              ref={emailRef}
              {...emailRest}
            />
          </div>
          {errors.email?.message ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium">Senha</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="********"
              type="password"
              autoComplete="current-password"
              ref={passwordRef}
              {...passwordRest}
            />
          </div>
          {errors.password?.message ? (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          ) : null}
        </div>

        <Button
          className="w-full hover:opacity-90"
          disabled={isLoading || success}
          type="submit"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Entrando...
            </span>
          ) : success ? (
            "Redirecionando..."
          ) : (
            "Entrar"
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          Ao entrar, você concorda com os termos de uso da aplicação.
        </p>
      </form>
    </div>
  );
}

import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import z from "zod"
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { api } from "@/lib/axios";
import Cookies from "js-cookie"
import { Navigate, redirect } from "react-router-dom";
import { LoaderCircle } from "lucide-react"

const LoginSchema = z.object({
  email: z.email({error: "Email inválido!"}),
  password: z.string().min(6, {error: "A senha deve ter no mínimo 6 caracteres!"}),
}).required()

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
      const response = await api
        .post("/sessions/password", data, { withCredentials: true })
        .finally(() => {
          setIsLoading(false);
          resetField("password");
        })

        Cookies.set("token", response.data.accessToken) 
        setSuccess(true);  
    } catch (error) {
      setErrorMessage((error as any).response.data.message);
    }
  }

  if (success) {
   return <Navigate to="/" replace /> 
  }

  return (
    <form 
      className="p-8 space-y-4"
      onSubmit={handleSubmit(onsSubmit)}
      noValidate
    >
      <h1>Login</h1>
      {errorMessage ? <span className="text-red-500">{errorMessage}</span> : ""}
      <div className="space-y-0.5">
        <Input
          placeholder="E-mail"
          ref={emailRef}
          {...emailRest}
        />
        {errors.email?.message ? (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        ) : (
          ""
        )}
      </div>
      <div className="space-y-0.5">
        <Input
          placeholder="************"
          type="password"
          ref={passwordRef}
          {...passwordRest}
        />
        {errors.password?.message ? (
          <span className="text-sm text-red-500">{errors.password.message}</span>
        ) : (
          ""
        )}
      </div>
      <Button 
        className="hover:opacity-80 cursor-pointer w-full"
        disabled={isLoading || success}
        type="submit"
      >
        {success ? 
          "Redirecionando..." 
        : isLoading ? 
          "Obtendo informações..." 
        : 
          "Entrar"}
      </Button>
    </form>
  )
}
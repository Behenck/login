import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { api } from "@/lib/axios";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { Mail, Lock, Loader2, AlertCircle } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";

const LoginSchema = z
	.object({
		email: z.email({ error: "Email inválido!" }),
		password: z
			.string()
			.min(6, { error: "A senha deve ter no mínimo 6 caracteres!" }),
	})
	.required();

export type LoginType = z.infer<typeof LoginSchema>;

export function LoginPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);

	const {
		handleSubmit,
		resetField,
		control,
	} = useForm<LoginType>({ resolver: zodResolver(LoginSchema) });

	const onsSubmit = async (data: LoginType) => {
		setIsLoading(true);

		try {
			const response = await api.post("/sessions/password", data, {
				withCredentials: true,
			});

			Cookies.set("token", response.data.accessToken);
			setSuccess(true);
		} catch (error) {
			toast.error(
				(error as any)?.response?.data?.message ??
					"Erro ao entrar. Tente novamente.",
			);
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
					<p className="text-sm text-muted-foreground">
						Acesse sua conta para continuar.
					</p>
				</div>

				<FieldGroup>
					<Controller
						name="email"
						control={control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Email</FieldLabel>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										{...field}
										className="pl-9"
										id="email"
										aria-invalid={fieldState.invalid}
										placeholder="seuemail@exemplo.com"
									/>
								</div>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>

				<FieldGroup>
					<Controller
						name="password"
						control={control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Senha</FieldLabel>
								<div className="relative">
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										{...field}
										className="pl-9"
										id="password"
										type="password"
										aria-invalid={fieldState.invalid}
										placeholder="************"
									/>
								</div>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>

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

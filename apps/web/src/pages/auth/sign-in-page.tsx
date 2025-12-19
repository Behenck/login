import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { api } from "@/lib/axios";
import Cookies from "js-cookie";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import Logo from "@/assets/finax-logo.svg";
import { AuthLayout } from "@/components/layouts/auth-layout";

const SignInSchema = z
	.object({
		email: z.email({ error: "Email inválido!" }),
		password: z
			.string()
			.min(6, { error: "A senha deve ter no mínimo 6 caracteres!" }),
	})
	.required();

export type SignInType = z.infer<typeof SignInSchema>;

export function SignInPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);
	const navigate = useNavigate()

	const {
		handleSubmit,
		resetField,
		control,
		watch,
	} = useForm<SignInType>({ 
			resolver: zodResolver(SignInSchema),
			defaultValues: {
				password: ""
			}
		});

		const email = watch("email")

	const onsSubmit = async (data: SignInType) => {
		setIsLoading(true);

		try {
			const response = await api.post("/sessions/password", data);
			Cookies.set("token", response.data.accessToken);
			setSuccess(true);
		} catch (error) {
			toast.error(
				(error as any)?.response?.data?.message ??
					"Erro ao entrar. Tente novamente.",
			);

			if ((error as any)?.response?.status === 403) {
				await api.post(`/auth/verification`, {
					email
				});

				return navigate(`/auth/verify-email?email=${data.email}`)
			}
		} finally {
			setIsLoading(false);
			resetField("password");
		}
	};

	if (success) {
		return <Navigate to="/" replace />;
	}

	return (
		<AuthLayout>
			<form
				className="space-y-4 w-full max-w-sm text-white"
				onSubmit={handleSubmit(onsSubmit)}
				noValidate
			>
				<div className="space-y-3 text-center">
					<div className="mx-auto bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center">
						<img src={Logo} className="w-8 h-8" />
					</div>
					<h1 className="text-3xl font-semibold tracking-tight">Bem-vindo de volta</h1>
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

				<Link to="/password/recover" className="text-sm text-zinc-100 hover:text-zinc-200 hover:underline font-medium">Esqueci minha senha</Link>

				<Button
					className="w-full hover:opacity-90 mt-2 cursor-pointer"
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
		</AuthLayout>
	);
}

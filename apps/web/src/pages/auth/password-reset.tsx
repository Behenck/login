import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import z from "zod";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { api } from "@/lib/axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, Loader2, ArrowLeft } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import Logo from "@/assets/finax-logo.svg";
import { AuthLayout } from "@/components/layouts/auth-layout";

const PasswordResetSchema = z
	.object({
		password: z.string()
			.min(6, { error: "A senha deve ter no mínimo 6 caracteres." }),
		confirmPassword: z
			.string()
			.min(6, { error: "A confirmação de senha deve ter no mínimo 6 caracteres." }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "As senhas não conferem.",
	})
	.required();

export type PasswordResetType = z.infer<typeof PasswordResetSchema>;

export function PasswordResetPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const token = searchParams.get("token") ?? "";

	useEffect(() => {
		toast.error("Token inválido")
		if (!token) navigate("/password/recover")
	}, [token])

	const {
		handleSubmit,
		control,
	} = useForm<PasswordResetType>({ 
			resolver: zodResolver(PasswordResetSchema),
		});

	const onsSubmit = async (data: PasswordResetType) => {
		setIsLoading(true);

		try {
			const { confirmPassword, ...rest } = data;
			const payload = {
				code: token,
				...rest
			}

			await api.post("/password/reset", payload);

			toast.success("Senha redefinida com sucesso!")

			navigate("/auth/sign-in")
			setSuccess(true);
		} catch (error) {
			toast.error(
				(error as any)?.response?.data?.message ??
					"Erro ao redefinir senha. Tente novamente.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout>
			<form
				className="space-y-4 w-full max-w-sm text-white"
				onSubmit={handleSubmit(onsSubmit)}
				noValidate
			>
				<div className="space-y-3 text-center mb-15">
					<div className="mx-auto bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center">
						<Lock className="mx-auto text-green-600" />
					</div>
					<h1 className="text-3xl font-semibold tracking-tight">Redefinir Senha</h1>
					<p className="text-sm text-muted-foreground">
						Digite sua nova senha para redefinir o acesso à sua conta.
					</p>
				</div>

				<FieldGroup>
					<Controller
						name="password"
						control={control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Senha</FieldLabel>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										{...field}
										className="pl-9"
										id="password"
										type="password"
										aria-invalid={fieldState.invalid}
										placeholder="Mínimo de 6 caracteres"
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
						name="confirmPassword"
						control={control}
						render={({ field, fieldState }) => (
							<Field data-invalid={fieldState.invalid}>
								<FieldLabel>Confirme sua senha</FieldLabel>
								<div className="relative">
									<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Input
										{...field}
										className="pl-9"
										id="confirmPassword"
										type="password"
										aria-invalid={fieldState.invalid}
										placeholder="Confirme sua nova senha"
									/>
								</div>
								{fieldState.invalid && (
									<FieldError errors={[fieldState.error]} />
								)}
							</Field>
						)}
					/>
				</FieldGroup>

				<div className="space-y-2">
					<Button
						className="w-full hover:opacity-90 cursor-pointer bg-green-600 hover:bg-green-700 text-white"
						disabled={isLoading || success}
						type="submit"
					>
						{isLoading ? (
							<span className="flex items-center justify-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								Enviando...
							</span>
						) : success ? (
							"Redirecionando..."
						) : (
							"Redefinir Senha"
						)}
					</Button>

					<Button variant="outline" className="cursor-pointer w-full" asChild>
						<Link to="/auth/sign-in">
							<ArrowLeft />
							Voltar ao login
						</Link>
					</Button>
				</div>
			</form>
		</AuthLayout>
	);
}

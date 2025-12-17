import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import z from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { api } from "@/lib/axios";
import Cookies from "js-cookie";
import { Link, Navigate } from "react-router-dom";
import { Mail, Lock, Loader2 } from "lucide-react";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import Logo from "@/assets/finax-logo.svg";

const PasswordRecoverySchema = z
	.object({
		email: z.email({ error: "Email inválido!" }),
	})
	.required();

export type PasswordRecoveryType = z.infer<typeof PasswordRecoverySchema>;

export function PasswordRecoveryPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean>(false);

	const {
		handleSubmit,
		resetField,
		control,
		watch
	} = useForm<PasswordRecoveryType>({ 
			resolver: zodResolver(PasswordRecoverySchema),
		});

	const email = watch("email")

	const onsSubmit = async (data: PasswordRecoveryType) => {
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
		}
	};

	return (
		<div className="flex justify-between h-screen">
			<div className="relative flex-1 flex items-center justify-center">
				<img src={Logo} className="opacity-20 blur-md" alt="" />
				{/* <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-2xl">Você na frente sempre...</span> */}
			</div>
			<div className="w-xl bg-zinc-900 p-8 flex flex-col items-center justify-center">
				<form
					className="space-y-4 w-full max-w-sm text-white"
					onSubmit={handleSubmit(onsSubmit)}
					noValidate
				>
					<div className="space-y-3 text-center">
						<h1 className="text-3xl font-semibold tracking-tight">Esqueci minha senha</h1>
						<p className="text-sm text-muted-foreground">
							Digite seu email para receber instruções de redefinição de senha.
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
							"Enviar instruções"
						)}
					</Button>

					<p className="text-sm text-muted-foreground text-center">
						Lembrou da senha? <Link to="/login" className="font-medium text-gray-100 hover:text-gra-200 hover:underline">Fazer login</Link>
					</p>
				</form>
			</div>
		</div>
	);
}

import { Button } from "../../components/ui/button";
import { useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Logo from "@/assets/finax-logo.svg";
import { AuthLayout } from "@/components/layouts/auth-layout";

export function PasswordForgotPage() {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const navigate = useNavigate()
	const [searchParams] = useSearchParams()
	const email = searchParams.get("email") ?? "";

	useEffect(() => {
		if (!email) {
			toast.error("Email inválido")
			navigate("/password/recover")
		}
	}, [email])

	const onSubmit = async (event: FormEvent) => {
		event.preventDefault(); 
		setIsLoading(true);

		try {
			await api.post("/password/recover", {
				email
			});

			toast.success("Email de redefinição de senha enviado com sucesso!")
		} catch (error) {
			toast.error(
				(error as any)?.response?.data?.message ??
					"Erro ao enviar email. Tente novamente.",
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<AuthLayout>
				<form
					className="space-y-4 w-full max-w-sm text-white"
					onSubmit={onSubmit}
					noValidate
				>
					<div className="space-y-3 text-center">
						<div className="mx-auto bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center">
							<CheckCheck className="mx-auto text-green-600" />
						</div>
						<h1 className="text-3xl font-semibold tracking-tight">Email enviado!</h1>
						<div>
							<p className="text-sm text-muted-foreground">
								Enviamos as instruções para redefinir sua senha para:
							</p>
							<span className="font-medium text-sm">{email}</span>
						</div>
					</div>

					<div className="space-y-2 text-center text-sm p-4 bg-zinc-800 rounded-lg text-zinc-400 mt-10">
						<p>Não recebeu o email?</p>
						<div className="flex flex-col">
							<span>• Verifique sua caixa de spam</span>
							<span>• Aguarde alguns minutos</span>
							<span>• Confirme se o email está correto</span>
						</div>
					</div>

					<Button
						className="w-full hover:opacity-90 cursor-pointer"
						variant="outline"
						disabled={isLoading}
						type="submit"
					>
						{isLoading ? (
							<span className="flex items-center justify-center gap-2">
								<Loader2 className="h-4 w-4 animate-spin" />
								Enviando...
							</span>
						) : (
							"Reenviar email"
						)}
					</Button>
					<Button asChild className="cursor-pointer w-full text-green-600 hover:text-green-700 hover:underline" variant="link">
						<Link to="/auth/sign-in">
							<ArrowLeft />
							Voltar para o login
						</Link>
					</Button>
			</form>
		</AuthLayout>
	);
}

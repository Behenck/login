import { Button } from "@/components/ui/button";
import {
	ArrowLeft,
	Building2,
	CheckCheck,
	Loader2,
	UserPlus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Logo from "@/assets/finax-logo.svg";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { Invite } from "@/@types/invite";
import { api } from "@/lib/axios";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";
import { AuthLayout } from "@/components/layouts/auth-layout";

const CreateMemberSchema = z
	.object({
		name: z.string().min(3, { error: "Mínimo 3 caracteres!" }),
		lastName: z.string().min(3, { error: "Mínimo 3 caracteres!" }),
		email: z
      .email()
			.optional(),
		password: z
			.string()
			.min(6, { error: "A senha deve ter no mínimo 6 caracteres!" }),
		confirmPassword: z
			.string()
			.min(6, { error: "A confirmação de senha deve ter no mínimo 6 caracteres." }),
	})
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "As senhas não conferem.",
  });

export type CreateMemberType = z.infer<typeof CreateMemberSchema>;

export function AcceptInvite() {
	const { inviteId } = useParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(true);
	const [invite, setInvite] = useState<Invite | null>(null);

	const {
		handleSubmit,
		resetField,
		control,
		watch,
		setValue,
		unregister,
	} = useForm<CreateMemberType>({
		resolver: zodResolver(CreateMemberSchema),
		defaultValues: {
			name: "",
			lastName: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const name = watch("name")
	const shouldAskEmail = invite?.type === "LINK";

	async function validate(code: string) {
    const token = code.trim();

    if (!token) {
      toast.error("Informe o token do convite.");
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await api.get(`/invites/${token}`);
			setInvite(data.invite)
    } catch {
      toast.error("Convite inválido ou expirado!");
			navigate(`/invites/${token}/validate`, { replace: true });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (inviteId) validate(inviteId);
  }, [inviteId]);

	useEffect(() => {
		if (!invite) return;

		if (invite.type === "EMAIL") {
			setValue("email", invite.email ?? "", { shouldValidate: false });
			unregister("email");
			resetField("email");
		} else {
			setValue("email", "", { shouldValidate: false });
		}
	}, [invite, setValue, unregister, resetField]);

	const onsSubmit = async (data: CreateMemberType) => {
		setIsLoading(true);

		const { confirmPassword, ...rest } = data;

		const finalEmail =
			invite?.type === "EMAIL"
				? invite.email
				: rest.email;

		const payload = {
			...rest,
			email: finalEmail,
		};

		try {
			await api.post(`/invites/${inviteId}/accept`, payload);

			await api.post(`/auth/verification`, {
				email: payload.email
			});
		} finally {
			setIsLoading(false);
			resetField("password");
			resetField("confirmPassword");

			navigate(`/auth/verify-email?email=${finalEmail ?? ""}`);
		}
	};

	return (
		<AuthLayout>
				{!isLoading && invite ? (
					<div className="space-y-6 w-full max-w-md text-white">
						<div className="mx-auto bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center">
							<CheckCheck className="text-green-600" />
						</div>

						<div className="text-center">
							<h1 className="text-3xl font-bold">Convite Válido!</h1>
							<span className="text-gray-400 text-sm">
								Você foi convidado para se juntar à rede
							</span>
						</div>

						<div className="flex gap-4 items-center bg-zinc-800 p-4 rounded-lg">
							<Building2 className="w-10 h-10" />
							<div className="flex flex-col">
								<p className="font-medium">{invite.organization.name}</p>
								<span className="text-sm text-gray-400">
									Convidado por: {invite.author.name}
								</span>
								<span className="text-sm text-green-400 font-medium">
									Bem-vindo(a) {name}! Defina sua senha para acessar a
									rede.
								</span>
							</div>
						</div>

						<form
							onSubmit={handleSubmit(onsSubmit)}
							noValidate
							className="space-y-3"
						>
							<div className="flex gap-2">
								<FieldGroup>
									<Controller
										name="name"
										control={control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel>Nome</FieldLabel>
												<Input
													{...field}
													id="name"
													aria-invalid={fieldState.invalid}
													placeholder="Seu nome"
													autoComplete="off"
												/>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>
								</FieldGroup>
								<FieldGroup>
									<Controller
										name="lastName"
										control={control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel>Sobrenome</FieldLabel>
												<Input
													{...field}
													id="lastName"
													aria-invalid={fieldState.invalid}
													placeholder="Seu sobrenome"
													autoComplete="off"
												/>
												{fieldState.invalid && (
													<FieldError errors={[fieldState.error]} />
												)}
											</Field>
										)}
									/>
								</FieldGroup>
							</div>
							{shouldAskEmail && (
								<FieldGroup>
									<Controller
										name="email"
										control={control}
										render={({ field, fieldState }) => (
											<Field data-invalid={fieldState.invalid}>
												<FieldLabel>Email</FieldLabel>
												<Input
													{...field}
													id="email"
													aria-invalid={fieldState.invalid}
													placeholder="joao.silva@dominio.com"
													autoComplete="off"
												/>
												{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
											</Field>
										)}
									/>
								</FieldGroup>
							)}
							<FieldGroup>
								<Controller
									name="password"
									control={control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel>Senha</FieldLabel>
											<Input
												{...field}
												id="password"
												aria-invalid={fieldState.invalid}
												placeholder="Mínimo 6 caracteres"
                        type="password"
												autoComplete="off"
											/>
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
											<FieldLabel>Confirmar Senha</FieldLabel>
											<Input
												{...field}
												id="confirmPassword"
												aria-invalid={fieldState.invalid}
												placeholder="Confirme sua senha"
                        type="password"
												autoComplete="off"
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>
							</FieldGroup>
							<div className="space-y-2">
								<Button
									type="submit"
									className="w-full bg-green-700 hover:bg-green-800 text-white cursor-pointer"
								>
									Aceitar Convite
								</Button>
								<Button
									type="button"
									variant="outline"
									className="w-full cursor-pointer"
									asChild
								>
									<Link to="/invites">
										<ArrowLeft />
										Voltar
									</Link>
								</Button>
							</div>
						</form>
					</div>
				) : (
					<div className="space-y-4 w-full max-w-md text-white">
						<div className="mx-auto bg-white w-12 h-12 rounded-full flex items-center justify-center">
							<UserPlus className="text-zinc-900" />
						</div>

						<div className="text-center">
							<h1 className="text-3xl font-bold">Validando Convite</h1>
							<span className="text-gray-400 text-sm">
								Aguarde enquanto validamos seu convite...
							</span>
						</div>

						<div className="space-y-2 mt-10 flex flex-col items-center justify-center">
							<Loader2 className="animate-spin w-6 h-6" />
							<span className="text-gray-400">Validando convite...</span>
						</div>
					</div>
			)}
		</AuthLayout>
	);
}

import { Button } from "@/components/ui/button";
import { ArrowLeft, MailWarning, UserPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import Logo from "@/assets/finax-logo.svg";
import { Link, useSearchParams } from "react-router-dom";

export function VerifyEmailOTP() {
	const [searchParams] = useSearchParams()
	const email = searchParams.get("email")

	return (
		<div className="flex justify-between h-screen">
			<div className="relative flex-1 flex items-center justify-center">
				<img src={Logo} className="opacity-20 blur-md" alt="" />
				{/* <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-2xl">Você na frente sempre...</span> */}
			</div>
			<div className="w-xl bg-zinc-900 p-8 flex flex-col items-center justify-center">
				<form className="space-y-4 w-full max-w-md text-white">
					<div className="mx-auto bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center">
						<MailWarning className="text-green-600" />
					</div>

					<div className="text-center space-y-2">
						<h1 className="text-3xl font-bold">Verifique seu email</h1>
						<div className="flex flex-col">
							<span className="text-gray-400 text-sm">
								Enviamos um código de 6 dígitos para
							</span>
							<span className="text-sm font-bold">{email}</span>
						</div>
					</div>

					<div className="space-y-3 mt-8">
						<div className="flex flex-col gap-2">
							<Label>Código de verificação</Label>
							 <InputOTP maxLength={6}>
								<InputOTPGroup className="gap-3">
									<InputOTPSlot
										index={0}
										className="w-15 h-15 text-xl border rounded-md"
									/>
									<InputOTPSlot
										index={1}
										className="w-15 h-15 text-xl border rounded-md"
									/>
									<InputOTPSlot
										index={2}
										className="w-15 h-15 text-xl border rounded-md"
									/>
								</InputOTPGroup>

								<InputOTPSeparator />

								<InputOTPGroup className="gap-3">
									<InputOTPSlot
										index={3}
										className="w-15 h-15 text-xl border rounded-md"
									/>
									<InputOTPSlot
										index={4}
										className="w-15 h-15 text-x border rounded-md"
									/>
									<InputOTPSlot
										index={5}
										className="w-15 h-15 text-xl border rounded-md"
									/>
								</InputOTPGroup>
							</InputOTP>

						</div>

						<div className="space-y-2">
							<Button className="w-full cursor-pointer bg-green-700 hover:bg-green-800 text-white">
							Verificar código
						</Button>

						<Button variant="outline" className="w-full cursor-pointer" asChild>
							<Link to="/">
								<ArrowLeft />
								Voltar
							</Link>
						</Button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}

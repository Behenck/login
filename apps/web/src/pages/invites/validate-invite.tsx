import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Logo from "@/assets/finax-logo.svg";
import { redirect, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export function ValidateInvite() {
	const { inviteId } = useParams();
	const navigate = useNavigate();

	useEffect(() => {
		if (!inviteId) {
			navigate("/invites", { replace: true });
			return;
		}
		async function validateInvite() {
			try {
				const { data } = await api.get(`/invites/${inviteId}`);
				if (!data?.invite) {
					navigate("/invites", { replace: true });
					return;
				}
				navigate(`/invites/${inviteId}/accept`, { replace: true });
			} catch {
				toast.error("Convite inválido ou expirado!");
				navigate("/invites", { replace: true });
			}
		}
		validateInvite();
	}, [inviteId, navigate]);

	return (
		<div className="flex justify-between h-screen">
			<div className="relative flex-1 flex items-center justify-center">
				<img src={Logo} className="opacity-20 blur-md" alt="" />
				{/* <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-2xl">Você na frente sempre...</span> */}
			</div>
			<div className="w-xl bg-zinc-900 p-8 flex flex-col items-center justify-center">
				<form className="space-y-4 w-full max-w-md text-white">
					<div className="mx-auto bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center">
						<UserPlus className="text-zinc-900" />
					</div>

					<div className="text-center">
						<h1 className="text-3xl font-bold">Validar Convite</h1>
						<span className="text-gray-400 text-sm">
							Digite o token de convite que você recebeu
						</span>
					</div>

					<div className="space-y-3 mt-8">
						<div className="space-y-2 w-full">
							<Label>Token de Convite</Label>
							<Input
								placeholder="abc123xyz..."
								className="border-zinc-700! bg-zinc-800!"
							/>
						</div>

						<Button className="w-full cursor-pointer bg-green-700 hover:bg-green-800 text-white">
							Validar Convite
						</Button>
					</div>
				</form>
			</div>
		</div>
	);
}

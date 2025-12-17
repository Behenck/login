import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Logo from "@/assets/finax-logo.svg";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export function ValidateInvite() {
	const { inviteId } = useParams();
	const [inviteCode, setInviteCode] = useState(inviteId ?? "");
	const [isLoading, setIsLoading] = useState(false);
	const navigate = useNavigate();

	async function validate(code: string) {
    const token = code.trim();

    if (!token) {
      toast.error("Informe o token do convite.");
      return;
    }

    try {
      setIsLoading(true);

      const { data } = await api.get(`/invites/${token}`);

      if (!data?.invite) {
        toast.error("Convite inválido ou expirado!");
        return;
      }

      navigate(`/invites/${token}/accept`, { replace: true });
    } catch {
      toast.error("Convite inválido ou expirado!");
    } finally {
      setIsLoading(false);
    }
  }

	function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    validate(inviteCode);
  }

  useEffect(() => {
    if (inviteId) validate(inviteId);
  }, [inviteId]);

	return (
		<div className="flex justify-between h-screen">
			<div className="relative flex-1 flex items-center justify-center">
				<img src={Logo} className="opacity-20 blur-md" alt="" />
				{/* <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-2xl">Você na frente sempre...</span> */}
			</div>
			<div className="w-xl bg-zinc-900 p-8 flex flex-col items-center justify-center">
				<div className="space-y-4 w-full max-w-md text-white">
					<div className="mx-auto bg-zinc-800 w-12 h-12 rounded-full flex items-center justify-center">
						<UserPlus className="text-zinc-900" />
					</div>

					<div className="text-center">
						<h1 className="text-3xl font-bold">Validar Convite</h1>
						<span className="text-gray-400 text-sm">
							Digite o token de convite que você recebeu
						</span>
					</div>

					<form 
						className="space-y-3 mt-8"
						onSubmit={handleSubmit}	
					>
						<div className="space-y-2 w-full">
							<Label>Token de Convite</Label>
							<Input
								value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
								placeholder="abc123xyz..."
								className="border-zinc-700! bg-zinc-800!"
								disabled={isLoading}
							/>
						</div>

						<Button
              className="w-full cursor-pointer bg-green-700 hover:bg-green-800 text-white"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Validando..." : "Validar Convite"}
            </Button>
					</form>
				</div>
			</div>
		</div>
	);
}

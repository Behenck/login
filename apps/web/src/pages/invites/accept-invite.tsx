import { Card } from "@/components/ui/card";
import Logo from "@/assets/finax-logo.svg"
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { useParams } from "react-router-dom";

interface Invite {
  author: {
    id: string
    name: string
    avatarUrl: string
  }
  email: string
  id: string
  role: string
  organization: {
    name: string
  }
  createdAt: Date
}

export function AcceptInvite() {
  const { inviteId } = useParams();
  const [invite, setInvite] = useState<Invite | null>(null);

  useEffect(() => {
    const getInvite = async () => {
      const { data } = await api.get(`/invites/${inviteId}`);
      setInvite(data.invite);
    };

    if (inviteId) getInvite();
  }, [inviteId]);

  if (!invite) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="px-10 py-8 max-w-lg w-full">
          Carregando convite...
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="px-10 flex flex-col justify-center gap-6 max-w-lg">
        <img src={Logo} className="w-22 h-22 mx-auto" alt="Logo Finax" />

        <div className="space-y-2 px-12 text-center">
          <h1 className="text-2xl font-bold">Você foi convidado</h1>

          <div>
            <span className="text-muted-foreground text-sm text-justify block">
              A equipe da{" "}
              <span className="text-foreground">{invite.organization.name}</span>{" "}
              convidou você para colaborar no sistema. Confirme seus dados abaixo
            </span>
            <span className="text-muted-foreground text-sm text-center block">
              para ganhar acesso.
            </span>
          </div>
        </div>

        <div className="flex flex-col text-sm border rounded p-3 border-l-[5px] border-l-green-500">
          <span className="text-muted-foreground">Acessando como:</span>
          <span className="font-bold text-foreground">{invite.email}</span>
        </div>

        <Button className="h-10 bg-green-700 hover:bg-green-800 text-white cursor-pointer">
          Aceitar convite e entrar
        </Button>

        <div className="flex flex-col gap-0">
          <span className="text-center text-sm text-muted-foreground">
            Não é você ou não esperava esse convite?
          </span>
          <Button variant="link" className="underline h-5 cursor-pointer text-sm" size="sm">
            Recusar convite
          </Button>
        </div>
      </Card>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import Logo from "@/assets/finax-logo.svg"
import { Button } from "@/components/ui/button";

export function AcceptInvite() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="px-10 flex flex-col justify-center gap-6 align-center max-w-lg">
        <img src={Logo} className="w-22 h-22 mx-auto" alt="Logo Finax" />
        <div className="space-y-2 px-12 text-center">
          <h1 className="text-2xl font-bold">Você foi convidado</h1>
          <div>
            <span className="text-muted-foreground text-sm text-justify block">
              A equipe da <span className="text-foreground">Finax G.I</span> convidou você para colaborar
              no sistema. Confirme seus dados abaixo
            </span>
            <span className="text-muted-foreground text-sm text-center block">
              para ganhar acesso.
            </span>
          </div>
        </div>
        <div className="flex flex-col text-sm border rounded p-3 border-l-5 border-l-green-500">
          <span className="text-muted-foreground">Acessando como:</span>
          <span className="font-bold text-foreground">denilson@arkogrupo.com</span>
        </div>

        <Button className="h-10 bg-green-700 hover:bg-green-800 text-white cursor-pointer">Aceitar convite e entrar</Button>

        <div className="flex flex-col gap-0">
          <span className="text-center text-sm text-muted-foreground">Não é você ou não esperava esse convite?</span>
          <Button variant="link" className="underline h-5 cursor-pointer text-sm" size="sm">Recusar convite</Button>
        </div>
      </Card>
    </div>

  )
}
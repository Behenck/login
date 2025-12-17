import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { Link } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function InviteMemberLink() {
  const [inviteLink, setInviteLink] = useState("")

  async function handleCreateInviteLink() {
    try {
      const organizationDomain = "finax-gi";
      const { data } = await api.post(`/organizations/${organizationDomain}/invites/link`)

      if (data.url) {
        setInviteLink(data.url)

        await navigator.clipboard.writeText(data.url);

        toast.success("Link copiado para a área de transferência!")
      }
    } catch (error) {
      toast.error((error as any).response.data.message)
    }
  }

  return (
    <div className="space-y-2">
      <div>
        <h2>Convidar membro</h2>
        <span className="text-muted-foreground text-sm">
          Convidar membro via email
        </span>
      </div>
      <Button
        variant="outline"
        className="cursor-pointer bg-transparent!"
        size="sm"
        onClick={handleCreateInviteLink}
      >
        <Link />
        <span>Convidar via link</span>
      </Button>

      {inviteLink ?? (<span>{inviteLink}</span>)}
    </div>
  )
}
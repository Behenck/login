import { Button } from "@/components/ui/button";
import { Link } from "lucide-react";

export function InviteMemberLink() {
  function handleCreateInviteLink() {
    
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
    </div>
  )
}
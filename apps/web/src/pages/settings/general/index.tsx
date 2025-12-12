import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ellipsis, Link } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function GeneralPage() {
  return (
    <div className="p-4 space-y-8">
      <div className="grid grid-cols-2">
        <div className="space-y-2">
          <div>
            <h2>Invite member</h2>
            <span className="text-muted-foreground text-sm">Convidar membro via email</span>
          </div>
          <Button variant="link" className="cursor-pointer">
            <Link />
            <span>Convidar via link</span>
          </Button>
        </div>
        <div className="space-y-2">
          <div className="flex gap-2">
            <div className="space-y-1 flex-1">
              <Label>Email</Label>
              <Input
                placeholder="joao.silva@dominio.com"
              />
            </div>
            <div className="space-y-1">
              <Label>Permissão</Label>
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue defaultValue="seller" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="seller">Vendedor</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button className="w-full cursor-pointer" variant="outline">Enviar convite</Button>
        </div>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between items-center gap-2">
          <Input placeholder="Buscar membros" className="flex-1" />
          <Select>
            <SelectTrigger className="w-[120px]">
              <SelectValue defaultValue="all-roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="seller">Vendedor</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="terms-2" className="w-5 h-5" />
              <Label>Selecionar todos (2)</Label>
            </div>
            <Button variant="outline">
              <Ellipsis />
            </Button>
          </div>  
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox id="terms-2" className="w-5 h-5" />
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/Behenck.png" />
                  <AvatarFallback>DB</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span>Denilson Behenck (me)</span>
                  <span className="text-xs text-muted-foreground">denilsontrespa10@gmail.com</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Owner</span>
              <Button variant="outline">
                <Ellipsis />
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Checkbox id="terms-2" className="w-5 h-5" />
              <div className="flex items-center gap-2">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="https://github.com/Behenck.png" />
                  <AvatarFallback>DB</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span>Denilson Behenck (me)</span>
                  <span className="text-xs text-muted-foreground">denilsontrespa10@gmail.com</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Owner</span>
              <Button variant="outline">
                <Ellipsis />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Ellipsis, Link, SearchIcon, X } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OrganizationMembers } from "../members/organization-members";
import { InviteMemberWithEmailAndRole } from "./invite-member-with-email-and-role";
import { InviteMemberLink } from "./invite-member-link";

export function MembersPage() {
	return (
		<div className="p-4 space-y-8">
			<div className="grid grid-cols-2">
				<InviteMemberLink />
				<InviteMemberWithEmailAndRole />
			</div>

			<Separator />

			<div>
				<Tabs defaultValue="members" className="w-full space-y-2">
					<TabsList className="justify-start bg-transparent p-0 border-b border-muted rounded-none h-auto w-full">
						<TabsTrigger
							value="members"
							className="
                group relative rounded-none bg-transparent p-3 border-none
                text-sm font-medium text-muted-foreground
                data-[state=active]:text-foreground
                data-[state=active]:bg-transparent!
                flex-0
              "
						>
							Membros da organização (12)
							<span
								className="
                  pointer-events-none absolute left-0 -bottom-px
                  h-0.5 w-full
                  group-data-[state=active]:bg-green-600
                "
							/>
						</TabsTrigger>

						<TabsTrigger
							value="pending-invites"
							className="
                group relative rounded-none bg-transparent p-3 border-none
                text-sm font-medium text-muted-foreground
                data-[state=active]:text-foreground
                data-[state=active]:bg-transparent!
                flex-0
              "
						>
							Convites pendentes (3)
							<span
								className="
                  pointer-events-none absolute left-0 -bottom-px
                  h-0.5 w-full
                  group-data-[state=active]:bg-green-600
                "
							/>
						</TabsTrigger>
					</TabsList>
					<TabsContent value="members" className="space-y-2">
						<OrganizationMembers />
					</TabsContent>
					<TabsContent value="pending-invites" className="space-y-2">
						<div className="flex justify-between items-center gap-2">
							<InputGroup>
								<InputGroupInput placeholder="Buscar convites" />
								<InputGroupAddon>
									<SearchIcon />
								</InputGroupAddon>
							</InputGroup>
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
									<Label className="text-muted-foreground">
										Selecionar todos (2)
									</Label>
								</div>
								<Button variant="outline" size="icon">
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
											<span className="text-xs text-muted-foreground">
												denilsontrespa10@gmail.com
											</span>
										</div>
									</div>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-muted-foreground text-sm">
										Vendedor
									</span>
									<Button variant="outline" size="icon">
										<X className="text-red-500" />
									</Button>
									<Button variant="outline" size="icon">
										<Check className="text-green-500" />
									</Button>
								</div>
							</div>
						</Card>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
}

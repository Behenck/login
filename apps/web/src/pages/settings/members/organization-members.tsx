import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Ellipsis, SearchIcon } from "lucide-react";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function OrganizationMembers() {
	return (
		<>
			<div className="flex justify-between items-center gap-2">
				<InputGroup>
					<InputGroupInput placeholder="Buscar membros" />
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
						<span className="text-muted-foreground text-sm">Dono</span>
						<Button variant="outline" size="icon">
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
								<span className="text-xs text-muted-foreground">
									denilsontrespa10@gmail.com
								</span>
							</div>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<span className="text-muted-foreground text-sm">Dono</span>
						<Button variant="outline" size="icon">
							<Ellipsis />
						</Button>
					</div>
				</div>
			</Card>
		</>
	);
}

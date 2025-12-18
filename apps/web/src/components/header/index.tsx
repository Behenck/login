import { LogOut, Moon } from "lucide-react";
import { Navbar } from "./navbar";
import Logo from "@/assets/finax-logo.svg";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ToggleTheme } from "../theme";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";

export function Header() {
	return (
		<div className="flex flex-col gap-2 px-8 pt-4 border-b-2 bg-zinc-100 dark:bg-[#0F0F11] ">
			<header className="flex gap-4 justify-between items-center">
				<div className="flex gap-4 items-center">
					<img src={Logo} className="w-10" />
					<h1 className="text-2xl font-bold">Finax</h1>
				</div>
				<div className="flex gap-4 items-center">
					<ToggleTheme />
					<Button variant="ghost" size="icon" className="cursor-pointer" asChild>
						<Link to="auth/sign-out">
							<LogOut />
						</Link>
					</Button>
					<Avatar>
						<AvatarImage src="https://github.com/behenck.png" />
						<AvatarFallback>DB</AvatarFallback>
					</Avatar>
				</div>
			</header>
			<Navbar />
		</div>
	);
}

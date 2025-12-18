import { type ReactNode } from "react";
import Logo from "@/assets/finax-logo.svg";

interface AuthLayoutProps {
	children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<div className="flex justify-between h-screen">
			<div className="relative flex-1 flex items-center justify-center">
				<img src={Logo} className="opacity-20 blur-md" alt="" />
				{/* <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-2xl">Você na frente sempre...</span> */}
			</div>
			<div className="w-xl bg-zinc-900 p-8 flex flex-col items-center justify-center">
				{children}
			</div>
		</div>
	);
}

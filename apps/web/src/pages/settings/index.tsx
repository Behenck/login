import { Button } from "@/components/ui/button";
import { Building, GitPullRequestDraft, Users } from "lucide-react";
import { Link, Outlet } from "react-router-dom";

export function SettingsPage() {
	return (
		<div className="flex items-center justify-center py-8 px-8">
			<div className="max-w-[1200px] w-full space-y-6">
				<div>
					<h1 className="font-bold text-xl">Configurações</h1>
				</div>
				<div className="grid grid-cols-4 gap-4">
					<div className="col-span-1">
						<nav>
							<div>
								<Link to="/settings">
									<Button
										variant="ghost"
										className="w-full justify-start space-x-2"
									>
										<GitPullRequestDraft className="rotate-90" />
										<span>Geral</span>
									</Button>
								</Link>
								<Link to="/settings/organization">
									<Button
										variant="ghost"
										className="w-full justify-start space-x-2"
									>
										<Building />
										<span>Organização</span>
									</Button>
								</Link>
								<Link to="/settings/members">
									<Button
										variant="ghost"
										className="w-full justify-start space-x-2"
									>
										<Users />
										<span>Membros</span>
									</Button>
								</Link>
							</div>
						</nav>
					</div>
					<div className="col-span-3">
						<Outlet />
					</div>
				</div>
			</div>
		</div>
	);
}

import { Navigate, Outlet, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layouts/main-layout";
import { isAuthenticated } from "@/auth/auth";

export function PrivateRoute() {
	const isUserAuthenticated = isAuthenticated()
	const location = useLocation();

	if (!isUserAuthenticated) {
		return (
			<Navigate
				to="/auth/sign-in"
				replace
				state={{ from: location }} // se quiser usar depois pra voltar
			/>
		);
	}

	return (
		<MainLayout>
			<Outlet />
		</MainLayout>
	);
}

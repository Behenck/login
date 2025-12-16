import { Navigate, Outlet, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
import { MainLayout } from "@/components/layouts/main-layout";

export function PrivateRoute() {
	const token = Cookies.get("token");
	const location = useLocation();

	if (!token) {
		return (
			<Navigate
				to="/login"
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

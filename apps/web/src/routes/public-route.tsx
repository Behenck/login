import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import { AuthLayout } from "@/components/layouts/auth-layout";

export function PublicRoute() {
	const token = Cookies.get("token");

	// if (token) {
	//   return <Navigate to="/" replace />;
	// }

	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
}

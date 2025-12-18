import { Navigate, Outlet } from "react-router-dom";
import { AuthLayout } from "@/components/layouts/auth-layout";
import { isAuthenticated } from "@/auth/auth";

export function PublicRoute() {
	const isUserAuthenticated = isAuthenticated()

	if (isUserAuthenticated) {
	  return <Navigate to="/" replace />;
	}

	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
}

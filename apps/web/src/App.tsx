import { LoginPage } from "./pages/auth/login-page";
import { Route, Routes, Navigate } from "react-router-dom";
import { HomePage } from "./pages/home";
import { PrivateRoute } from "./routes/private-route";
import { PublicRoute } from "./routes/public-route";
import { SettingsPage } from "./pages/settings";
import { MembersPage } from "./pages/settings/members";
import { GeneralPage } from "./pages/settings/general";
import { OrganizationPage } from "./pages/settings/organization";
import { ValidateInvite } from "./pages/invites/validate-invite";
import { AcceptInvite } from "./pages/invites/accept-invite";
import { VerifyEmailOTP } from "./pages/auth/verify-email-otp";
import { PasswordRecoveryPage } from "./pages/auth/password-recovery";

export function App() {
	return (
		<Routes>
			{/* Rotas públicas */}
			<Route element={<PublicRoute />}>
				<Route path="login" element={<LoginPage />} />
				<Route path="password-recovery" element={<PasswordRecoveryPage />} />
				<Route
					path="verify-email"
					element={<VerifyEmailOTP />}
				/>
				
				<Route path="invites" element={<ValidateInvite />} />
				<Route path="invites/:inviteId" element={<ValidateInvite />} />
				<Route path="invites/:inviteId/validate" element={<ValidateInvite />} />
				<Route path="invites/:inviteId/accept" element={<AcceptInvite />} />
			</Route>

			{/* Rotas protegidas */}
			<Route element={<PrivateRoute />}>
				<Route path="/" element={<HomePage />} />
				<Route path="settings" element={<SettingsPage />}>
					<Route index element={<GeneralPage />} />
					<Route path="members" element={<MembersPage />} />
					<Route path="organization" element={<OrganizationPage />} />
				</Route>
			</Route>
			{/* Rota desconhecida */}
			<Route path="*" element={<Navigate to="/" />} />
		</Routes>
	);
}

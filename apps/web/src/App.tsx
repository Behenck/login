import { LoginPage } from "./pages/auth/login-page";
import { Route, Routes, Navigate } from "react-router-dom";
import { HomePage } from "./pages/home";
import { PrivateRoute } from "./routes/private-route";
import { PublicRoute } from "./routes/public-route";
import { SettingsPage } from "./pages/settings";
import { MembersPage } from "./pages/settings/members";
import { GeneralPage } from "./pages/settings/general";
import { OrganizationPage } from "./pages/settings/organization";

export function App() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route element={<PublicRoute />}>
        <Route path="login" element={<LoginPage />} />
      </Route>
      
      {/* Rotas protegidas */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<HomePage />} />
        <Route path="settings" element={<SettingsPage />}>
          <Route index element={<GeneralPage />}/>
          <Route path="members" element={<MembersPage />} />
          <Route path="organization" element={<OrganizationPage />} />
        </Route>
      </Route>

      {/* Rota desconhecida */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

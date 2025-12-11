import { LoginPage } from "./pages/auth/login-page";
import { Route, Routes, Navigate } from "react-router-dom";
import { HomePage } from "./pages/home";
import { PrivateRoute } from "./routes/private-route";
import { PublicRoute } from "./routes/public-route";

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
      </Route>

      {/* Rota desconhecida */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

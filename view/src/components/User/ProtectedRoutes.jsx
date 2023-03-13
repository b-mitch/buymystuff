import { Navigate, Outlet } from "react-router-dom";


export default function ProtectedRoutes({token}) {
  return token ? <Outlet /> : <Navigate to="/login" />;
};

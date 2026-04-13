// import { Navigate } from "react-router-dom";
// import { useApp } from "../context/AppContext.jsx";

// export function ProtectedRoute({ children }) {
//   const { state } = useApp();
//   return state.isAdmin ? children : <Navigate to="/admin" replace />;
// }



// import { Navigate } from "react-router-dom";
// import { useAppStore } from "../store/appStore.js";

// export function ProtectedRoute({ children }) {
//   const isAdmin = useAppStore((s) => s.isAdmin);
//   return isAdmin ? children : <Navigate to="/admin" replace />;
// }



import { Navigate } from "react-router-dom";
import { useAppStore } from "../store/appStore.js";

export function ProtectedRoute({ children }) {
  const isAdmin = useAppStore((s) => s.isAdmin);
  return isAdmin ? children : <Navigate to="/admin" replace />;
}
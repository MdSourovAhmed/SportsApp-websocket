// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AppProvider } from "./context/AppContext.jsx";
// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "./assets/vite.svg";
// import heroImg from "./assets/hero.png";
// import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
// import Lobby from "./pages/Lobby.jsx";
// import GameRoom from "./pages/GameRoom.jsx";
// import Results from "./pages/Results.jsx";
// import AdminLogin from "./pages/AdminLogin.jsx";
// import AdminDashboard from "./pages/AdminDashboard.jsx";
// import "./App.css";

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <>
//       <AppProvider>
//         <BrowserRouter>
//           <Routes>
//             <Route path="/" element={<Lobby />} />
//             <Route path="/room/:id" element={<GameRoom />} />
//             <Route path="/results/:id" element={<Results />} />
//             <Route path="/admin" element={<AdminLogin />} />
//             <Route
//               path="/admin/dashboard"
//               element={
//                 <ProtectedRoute>
//                   <AdminDashboard />
//                 </ProtectedRoute>
//               }
//             />
//           </Routes>
//         </BrowserRouter>
//       </AppProvider>
//     </>
//   );
// }

// export default App;



// import { useEffect } from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { useWSStore } from "./store/wsStore.js";
// import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
// import Lobby from "./pages/Lobby.jsx";
// import GameRoom from "./pages/GameRoom.jsx";
// import Results from "./pages/Results.jsx";
// import AdminLogin from "./pages/AdminLogin.jsx";
// import AdminDashboard from "./pages/AdminDashboard.jsx";

// export default function App() {
//   const connect = useWSStore((s) => s.connect);

//   // Start the single WebSocket connection when the app boots.
//   // connect() checks `if (get().socket) return` so it is safe to call in
//   // StrictMode's double-invocation — the second call is always a no-op.
//   useEffect(() => {
//     connect();
//   }, [connect]);

//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/"               element={<Lobby />} />
//         <Route path="/room/:id"       element={<GameRoom />} />
//         <Route path="/results/:id"    element={<Results />} />
//         <Route path="/admin"          element={<AdminLogin />} />
//         <Route
//           path="/admin/dashboard"
//           element={
//             <ProtectedRoute>
//               <AdminDashboard />
//             </ProtectedRoute>
//           }
//         />
//       </Routes>
//     </BrowserRouter>
//   );
// }




import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useWSStore } from "./store/wsStore.js";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import Lobby from "./pages/Lobby.jsx";
import GameRoom from "./pages/GameRoom.jsx";
import Results from "./pages/Results.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

export default function App() {
  const connect = useWSStore((s) => s.connect);

  // Start the single WebSocket connection when the app boots.
  // connect() checks `if (get().socket) return` so it is safe to call in
  // StrictMode's double-invocation — the second call is always a no-op.
  useEffect(() => {
    connect();
  }, [connect]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<Lobby />} />
        <Route path="/room/:id"       element={<GameRoom />} />
        <Route path="/results/:id"    element={<Results />} />
        <Route path="/admin"          element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
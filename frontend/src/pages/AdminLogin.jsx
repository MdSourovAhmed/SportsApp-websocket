// // import { useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useApp } from "../context/AppContext.jsx";

// // export default function AdminLogin() {
// //   const { login } = useApp();
// //   const navigate = useNavigate();
// //   const [password, setPassword] = useState("");
// //   const [error, setError] = useState("");
// //   const [shake, setShake] = useState(false);

// //   const handleSubmit = (e) => {
// //     e.preventDefault();
// //     if (login(password)) {
// //       navigate("/admin/dashboard");
// //     } else {
// //       setError("Incorrect password");
// //       setShake(true);
// //       setTimeout(() => setShake(false), 500);
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
// //       <div className="w-full max-w-sm">
// //         {/* Logo */}
// //         <div className="text-center mb-10">
// //           <span className="text-3xl font-black tracking-tight">
// //             <span className="text-white">ARENA</span>
// //             <span className="text-red-500">LIVE</span>
// //           </span>
// //           <p className="text-slate-500 text-sm mt-2">Admin Access</p>
// //         </div>

// //         <div
// //           className={`rounded-2xl border border-slate-800 bg-slate-900 p-8 transition-all duration-150 ${
// //             shake ? "translate-x-2" : ""
// //           }`}
// //           style={{ animation: shake ? "shake 0.4s ease" : "none" }}
// //         >
// //           <h1 className="text-xl font-bold text-white mb-6">Sign in</h1>

// //           <form onSubmit={handleSubmit} className="space-y-4">
// //             <div>
// //               <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">
// //                 Admin Password
// //               </label>
// //               <input
// //                 type="password"
// //                 value={password}
// //                 onChange={e => { setPassword(e.target.value); setError(""); }}
// //                 placeholder="Enter password"
// //                 autoFocus
// //                 className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors text-sm"
// //               />
// //               {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
// //             </div>

// //             <button
// //               type="submit"
// //               className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors"
// //             >
// //               Enter Admin Panel →
// //             </button>
// //           </form>
// //         </div>

// //         <p className="text-center text-slate-700 text-xs mt-6">
// //           Set <code className="text-slate-500">VITE_ADMIN_PASSWORD</code> in .env
// //         </p>

// //         <div className="text-center mt-4">
// //           <a href="/" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">
// //             ← Back to Lobby
// //           </a>
// //         </div>
// //       </div>

// //       <style>{`
// //         @keyframes shake {
// //           0%,100% { transform: translateX(0); }
// //           20%      { transform: translateX(-8px); }
// //           40%      { transform: translateX(8px); }
// //           60%      { transform: translateX(-6px); }
// //           80%      { transform: translateX(4px); }
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAppStore } from "../store/appStore.js";

// export default function AdminLogin() {
//   const login = useAppStore((s) => s.login);
//   const navigate = useNavigate();
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [shake, setShake] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (login(password)) {
//       navigate("/admin/dashboard");
//     } else {
//       setError("Incorrect password");
//       setShake(true);
//       setTimeout(() => setShake(false), 500);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
//       <div className="w-full max-w-sm">
//         <div className="text-center mb-10">
//           <span className="text-3xl font-black tracking-tight">
//             <span className="text-white">ARENA</span><span className="text-red-500">LIVE</span>
//           </span>
//           <p className="text-slate-500 text-sm mt-2">Admin Access</p>
//         </div>

//         <div
//           className="rounded-2xl border border-slate-800 bg-slate-900 p-8"
//           style={{ animation: shake ? "shake 0.4s ease" : "none" }}
//         >
//           <h1 className="text-xl font-bold text-white mb-6">Sign in</h1>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">Admin Password</label>
//               <input
//                 type="password"
//                 value={password}
//                 onChange={(e) => { setPassword(e.target.value); setError(""); }}
//                 placeholder="Enter password"
//                 autoFocus
//                 className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors text-sm"
//               />
//               {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
//             </div>
//             <button type="submit" className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors">
//               Enter Admin Panel →
//             </button>
//           </form>
//         </div>

//         <p className="text-center text-slate-700 text-xs mt-6">
//           Set <code className="text-slate-500">VITE_ADMIN_PASSWORD</code> in .env
//         </p>
//         <div className="text-center mt-4">
//           <a href="/" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">← Back to Lobby</a>
//         </div>
//       </div>
//       <style>{`
//         @keyframes shake {
//           0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)}
//           40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(4px)}
//         }
//       `}</style>
//     </div>
//   );
// }
















import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/appStore.js";

export default function AdminLogin() {
  const login = useAppStore((s) => s.login);
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login(password)) {
      navigate("/admin/dashboard");
    } else {
      setError("Incorrect password");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <span className="text-3xl font-black tracking-tight">
            <span className="text-white">ARENA</span><span className="text-red-500">LIVE</span>
          </span>
          <p className="text-slate-500 text-sm mt-2">Admin Access</p>
        </div>

        <div
          className="rounded-2xl border border-slate-800 bg-slate-900 p-8"
          style={{ animation: shake ? "shake 0.4s ease" : "none" }}
        >
          <h1 className="text-xl font-bold text-white mb-6">Sign in</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 uppercase tracking-widest mb-2">Admin Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter password"
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:border-red-500 transition-colors text-sm"
              />
              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
            </div>
            <button type="submit" className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors">
              Enter Admin Panel →
            </button>
          </form>
        </div>

        <p className="text-center text-slate-700 text-xs mt-6">
          Set <code className="text-slate-500">VITE_ADMIN_PASSWORD</code> in .env
        </p>
        <div className="text-center mt-4">
          <a href="/" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">← Back to Lobby</a>
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)} 60%{transform:translateX(-6px)} 80%{transform:translateX(4px)}
        }
      `}</style>
    </div>
  );
}
// // const BASE = import.meta.env.VITE_API_URL || "http://localhost:7000";

// // async function request(method, path, body) {
// //   const res = await fetch(`${BASE}${path}`, {
// //     method,
// //     headers: { "Content-Type": "application/json" },
// //     body: body ? JSON.stringify(body) : undefined,
// //   });
// //   const json = await res.json();
// //   if (!res.ok) throw new Error(json.error || "Request failed");
// //   return json.data;
// // }

// // export const api = {
// //   // Matches
// //   getMatches: (limit = 100) => request("GET", `/matches?limit=${limit}`),
// //   createMatch: (body) => request("POST", "/matches", body),
// //   updateScore: (id, body) => request("PATCH", `/matches/${id}/score`, body),

// //   // Commentary
// //   getCommentary: (matchId, limit = 100) =>
// //     request("GET", `/matches/${matchId}/commentary?limit=${limit}`),
// //   postCommentary: (matchId, body) =>
// //     request("POST", `/matches/${matchId}/commentary`, body),
// // };


// import axios from "axios";

// // ── Axios instance ────────────────────────────────────────────────────────
// const client = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:7000",
//   timeout: 10_000,
//   headers: { "Content-Type": "application/json" },
// });

// // ── Response interceptor ──────────────────────────────────────────────────
// // The backend wraps every success in { data: ... }.
// // Unwrap it here so callers receive the payload directly.
// client.interceptors.response.use(
//   (response) => response.data.data,
//   (error) => {
//     // Normalise both network failures and HTTP errors into a single Error.
//     const message =
//       error.response?.data?.error ||    // backend JSON error field
//       error.response?.data?.message ||   // fallback message field
//       error.message ||                   // axios / network message
//       "An unexpected error occurred";

//     const normalized = new Error(message);
//     normalized.status = error.response?.status ?? null;
//     normalized.details = error.response?.data?.details ?? null;
//     return Promise.reject(normalized);
//   }
// );

// // ── API surface ───────────────────────────────────────────────────────────
// export const api = {
//   // Matches
//   getMatches: (limit = 100) =>
//     client.get("/matches", { params: { limit } }),

//   createMatch: (body) =>
//     client.post("/matches", body),

//   updateScore: (id, body) =>
//     client.patch(`/matches/${id}/score`, body),

//   // Commentary
//   getCommentary: (matchId, limit = 100) =>
//     client.get(`/matches/${matchId}/commentary`, { params: { limit } }),

//   postCommentary: (matchId, body) =>
//     client.post(`/matches/${matchId}/commentary`, body),
// };

// // Export the raw client for pages that need custom config (e.g. AbortSignal)
// export { client as axiosClient };









import axios from "axios";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:7000",
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

client.interceptors.response.use(
  (response) => response.data.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    const normalized = new Error(message);
    normalized.status  = error.response?.status ?? null;
    normalized.details = error.response?.data?.details ?? null;
    return Promise.reject(normalized);
  }
);

export const api = {
  // ── Matches ──────────────────────────────────────────────────────────────
  getMatches:   (limit = 100) => client.get("/matches", { params: { limit } }),
  getMatch:     (id)          => client.get(`/matches/${id}`),
  createMatch:  (body)        => client.post("/matches", body),

  // Edit mutable fields (scheduled matches only)
  editMatch:    (id, body)    => client.patch(`/matches/${id}`, body),

  // Score update (live matches only)
  updateScore:  (id, body)    => client.patch(`/matches/${id}/score`, body),

  // ── Casualty / admin actions ─────────────────────────────────────────────
  // Pause a live or scheduled match due to an incident
  suspendMatch: (id, reason)  =>
    client.post(`/matches/${id}/suspend`, { reason }),

  // Permanently halt — no winner declared
  abandonMatch: (id, reason)  =>
    client.post(`/matches/${id}/abandon`, { reason }),

  // Move to a new time window (scheduled or suspended)
  rescheduleMatch: (id, body) =>
    client.post(`/matches/${id}/reschedule`, body),

  // Admin ends match immediately with optional score override
  forceFinish:  (id, body)    =>
    client.post(`/matches/${id}/finish`, body),

  // Hard-delete (scheduled, abandoned, or finished only)
  deleteMatch:  (id)          =>
    client.delete(`/matches/${id}`),

  // ── Commentary ────────────────────────────────────────────────────────────
  getCommentary:  (matchId, limit = 100) =>
    client.get(`/matches/${matchId}/commentary`, { params: { limit } }),
  postCommentary: (matchId, body) =>
    client.post(`/matches/${matchId}/commentary`, body),
};

export { client as axiosClient };
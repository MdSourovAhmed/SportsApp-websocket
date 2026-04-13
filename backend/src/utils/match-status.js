


// import { MATCH_STATUS } from "../validation/matches.js";

// /**
//  * Derive the correct match status from its start/end times.
//  * @param {string|Date} startTime
//  * @param {string|Date} endTime
//  * @param {Date} [now=new Date()]
//  * @returns {"scheduled"|"live"|"finished"|null}  null if times are invalid
//  */
// export function getMatchStatus(startTime, endTime, now = new Date()) {
//   const start = new Date(startTime);
//   const end   = new Date(endTime);

//   if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
//     return null;
//   }

//   if (now < start) return MATCH_STATUS.SCHEDULED;
//   if (now >= end)  return MATCH_STATUS.FINISHED;
//   return MATCH_STATUS.LIVE;
// }

// /**
//  * Compare the stored status with the computed one and call updateStatus()
//  * if they differ. Mutates match.status to the authoritative value and
//  * returns it so callers don't need to read from match again.
//  *
//  * @param {{ status: string, startTime: Date, endTime: Date }} match
//  * @param {(nextStatus: string) => Promise<void>} updateStatus
//  * @returns {Promise<string>} the authoritative current status
//  */
// export async function syncMatchStatus(match, updateStatus) {
//   const nextStatus = getMatchStatus(match.startTime, match.endTime);

//   // If times are bad, don't touch the stored status
//   if (!nextStatus) return match.status;

//   if (match.status !== nextStatus) {
//     await updateStatus(nextStatus);
//     match.status = nextStatus;
//   }

//   return match.status;
// }




// import { MATCH_STATUS } from "../validation/matches.js";

// // Statuses that are set by admin action and must never be overwritten
// // by the clock-based auto-sync logic.
// const ADMIN_LOCKED = new Set([
//   MATCH_STATUS.SUSPENDED,
//   MATCH_STATUS.ABANDONED,
// ]);

// /**
//  * Derive the clock-based status from start/end times.
//  * Returns null if times are invalid.
//  */
// export function getMatchStatus(startTime, endTime, now = new Date()) {
//   const start = new Date(startTime);
//   const end   = new Date(endTime);

//   if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
//   if (now < start) return MATCH_STATUS.SCHEDULED;
//   if (now >= end)  return MATCH_STATUS.FINISHED;
//   return MATCH_STATUS.LIVE;
// }

// /**
//  * Compare the stored status with the computed one and call updateStatus()
//  * if they differ. Admin-locked statuses (suspended, abandoned) are never
//  * overwritten — only the admin can change those via dedicated endpoints.
//  *
//  * Returns the authoritative current status.
//  */
// export async function syncMatchStatus(match, updateStatus) {
//   // Never auto-transition out of admin-controlled statuses
//   if (ADMIN_LOCKED.has(match.status)) return match.status;

//   const nextStatus = getMatchStatus(match.startTime, match.endTime);
//   if (!nextStatus) return match.status;

//   if (match.status !== nextStatus) {
//     await updateStatus(nextStatus);
//     match.status = nextStatus;
//   }

//   return match.status;
// }



import { MATCH_STATUS } from "../validation/matches.js";

// Statuses that are set by admin action and must never be overwritten
// by the clock-based auto-sync logic.
const ADMIN_LOCKED = new Set([
  MATCH_STATUS.SUSPENDED,
  MATCH_STATUS.ABANDONED,
]);

/**
 * Derive the clock-based status from start/end times.
 * Returns null if times are invalid.
 */
export function getMatchStatus(startTime, endTime, now = new Date()) {
  const start = new Date(startTime);
  const end   = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
  if (now < start) return MATCH_STATUS.SCHEDULED;
  if (now >= end)  return MATCH_STATUS.FINISHED;
  return MATCH_STATUS.LIVE;
}

/**
 * Compare the stored status with the computed one and call updateStatus()
 * if they differ. Admin-locked statuses (suspended, abandoned) are never
 * overwritten — only the admin can change those via dedicated endpoints.
 *
 * Returns the authoritative current status.
 */
export async function syncMatchStatus(match, updateStatus) {
  // Never auto-transition out of admin-controlled statuses
  if (ADMIN_LOCKED.has(match.status)) return match.status;

  const nextStatus = getMatchStatus(match.startTime, match.endTime);
  if (!nextStatus) return match.status;

  if (match.status !== nextStatus) {
    await updateStatus(nextStatus);
    match.status = nextStatus;
  }

  return match.status;
}
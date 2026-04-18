import { MATCH_STATUS } from "../validation/matches.js";

/**
 * Determine a match's status relative to a reference time.
 *
 * @param {string|number|Date} startTime - Match start time; any value accepted by the Date constructor.
 * @param {string|number|Date} endTime - Match end time; any value accepted by the Date constructor.
 * @param {Date} [now=new Date()] - Reference time used to evaluate status.
 * @returns {string|null} One of `MATCH_STATUS.SCHEDULED`, `MATCH_STATUS.LIVE`, or `MATCH_STATUS.FINISHED`; returns `null` if `startTime` or `endTime` cannot be parsed as valid dates.
 */
export function getMatchStatus(startTime, endTime, now = new Date()) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  if (now < start) {
    return MATCH_STATUS.SCHEDULED;
  }
  if (now >= end) {
    return MATCH_STATUS.FINISHED;
  }

  return MATCH_STATUS.LIVE;
}

/**
 * Ensure a match object's status reflects its start/end times and persist any change.
 *
 * Calls getMatchStatus(match.startTime, match.endTime) to compute the desired status;
 * if the computed status differs from match.status, calls the provided updateStatus callback
 * and updates match.status with the new value.
 *
 * @param {object} match - Match record containing at least `startTime`, `endTime`, and `status`.
 * @param {(newStatus: string) => Promise<void>} updateStatus - Async callback invoked with the new status when an update is required.
 * @returns {string} The match's (possibly updated) status.
 */
export async function syncMatchStatus(match, updateStatus) {
  const nextStatus = getMatchStatus(match.startTime, match.endTime);

  if (!nextStatus) return match.status;

  if (match.status !== nextStatus) {
    await updateStatus(nextStatus);
    match.status = nextStatus;
  }

  return match.status;
}
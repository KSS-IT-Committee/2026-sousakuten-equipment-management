import "server-only";
/**
 * In-memory, per-process status only.
 * Not durable across restarts/deploys or multiple server instances, and may be overwritten by concurrent requests.
 */
type DbFetchKind = "equipment" | "borrowings";

let lastDbFetchAt: Date | null = null;
let lastDbFetchKind: DbFetchKind | null = null;

export function recordDbFetch(kind: DbFetchKind) {
  lastDbFetchAt = new Date();
  lastDbFetchKind = kind;
}

export function getLastDbFetch() {
  return {
    at: lastDbFetchAt,
    kind: lastDbFetchKind,
  };
}

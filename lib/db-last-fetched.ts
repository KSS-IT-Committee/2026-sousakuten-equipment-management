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

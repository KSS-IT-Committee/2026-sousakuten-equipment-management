#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"
COMPOSE_FILE="${REPO_DIR}/docker-compose.preview.yml"

remote_url=$(git -C "$REPO_DIR" remote get-url origin)
case "$remote_url" in
  *github.com[:/]* ) ;;
  *)
    echo "Error: origin remote must point to github.com, got: $remote_url" >&2
    exit 1
    ;;
esac
slug=${remote_url#*github.com[:/]}
slug=${slug%.git}
slug=$(printf '%s' "$slug" | tr '[:upper:]' '[:lower:]')

PROJECT="${PROJECT:-${slug}-preview}"

export IMAGE_SLUG="$slug"

if [ "$#" -ge 1 ]; then
  # A tag was given: pull the published preview image (e.g. pr-123, sha-abc, latest).
  TAG="$1"
  IMAGE="ghcr.io/${slug}/preview:${TAG}"
  echo "Pulling ${IMAGE}"
  docker pull "$IMAGE"
else
  # No tag: build the image from the current working tree (local preview).
  TAG="local"
  IMAGE="ghcr.io/${slug}/preview:${TAG}"
  echo "Building ${IMAGE} from ${REPO_DIR}"
  docker build -t "$IMAGE" "$REPO_DIR"
fi

export TAG

cleanup() {
  docker compose -p "$PROJECT" -f "$COMPOSE_FILE" down --remove-orphans >/dev/null || true
}
trap cleanup EXIT INT TERM

echo "Starting preview on http://localhost:3000 (Ctrl-C to stop)"
docker compose -p "$PROJECT" -f "$COMPOSE_FILE" up --remove-orphans

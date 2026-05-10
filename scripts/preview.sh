#!/usr/bin/env bash
set -euo pipefail

TAG="${1:-latest}"
PROJECT="equipment-preview"
COMPOSE_FILE="$(dirname "$0")/../docker-compose.preview.yml"

remote_url=$(git -C "$(dirname "$0")/.." remote get-url origin)
slug=${remote_url#*github.com[:/]}
slug=${slug%.git}
slug=$(printf '%s' "$slug" | tr '[:upper:]' '[:lower:]')

export IMAGE_SLUG="$slug"
export TAG

IMAGE="ghcr.io/${slug}/preview:${TAG}"

echo "Pulling ${IMAGE}"
docker pull "$IMAGE"

cleanup() {
  echo "Cleaning up..."
  docker compose -p "$PROJECT" -f "$COMPOSE_FILE" exec app npx drizzle-kit migrate --config=drizzle.config.ts
}
trap cleanup EXIT INT TERM

echo "Starting preview on http://localhost:3000 (Ctrl-C to stop)"

docker compose -p "$PROJECT" -f "$COMPOSE_FILE" up -d --remove-orphans

echo "Waiting for database to be ready..."
sleep 5

echo "Running database migrations..."
docker compose -p "$PROJECT" -f "$COMPOSE_FILE" exec app npx drizzle-kit migrate

docker compose -p "$PROJECT" -f "$COMPOSE_FILE" logs -f

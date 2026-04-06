#!/usr/bin/env bash
set -euo pipefail

export DEBIAN_FRONTEND=noninteractive

if ! command -v sudo >/dev/null 2>&1; then
  echo "sudo is required on the remote server." >&2
  exit 1
fi

if [[ -z "${SERVER_BASE_DIR:-}" || -z "${SERVER_REPO_DIR:-}" || -z "${SERVER_FRONTEND_DIR:-}" || -z "${SERVER_USER:-}" ]]; then
  echo "SERVER_BASE_DIR, SERVER_REPO_DIR, SERVER_FRONTEND_DIR, and SERVER_USER must be set." >&2
  exit 1
fi

sudo apt-get update
sudo apt-get install -y curl git nginx certbot python3-certbot-nginx

install_node=1
if command -v node >/dev/null 2>&1; then
  node_major="$(node -p "process.versions.node.split('.')[0]")"
  if [[ "${node_major}" -ge 20 ]]; then
    install_node=0
  fi
fi

if [[ "${install_node}" -eq 1 ]]; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi

if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm install -g pm2
fi

sudo mkdir -p "${SERVER_BASE_DIR}" "${SERVER_REPO_DIR}" "${SERVER_FRONTEND_DIR}"
sudo chown -R "${SERVER_USER}:${SERVER_USER}" "${SERVER_BASE_DIR}"

echo "Remote server bootstrap completed."
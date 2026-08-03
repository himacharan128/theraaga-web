#!/usr/bin/env bash
# Folder-scoped Vercel CLI.
#
# Reads the token from the workspace Credentials/ directory rather than from a
# global `vercel login`, so authentication never leaves this workspace and no
# other project on this machine inherits it.
#
#   npm run vercel -- ls
#   npm run vercel -- env ls production
#   npm run vercel -- deploy --prod
set -euo pipefail

TOKEN_FILE="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)/Credentials/vercel-token"

if [[ ! -f "$TOKEN_FILE" ]]; then
  cat >&2 <<'MSG'
No Vercel token found.

  1. https://vercel.com/account/tokens → Create Token
     Scope it to the account/team that owns theraaga-web.
  2. Save it to:  Raaga/Credentials/vercel-token
     (single line, no quotes — Credentials/ is gitignored)

MSG
  exit 1
fi

exec npx vercel --token "$(tr -d '[:space:]' < "$TOKEN_FILE")" "$@"

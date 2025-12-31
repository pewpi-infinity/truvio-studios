#!/data/data/com.termux/files/usr/bin/bash
# 🧱🍄⭐💲👑 C13B0 PAGE PUBLISHER — CLEAN MODE
set -e

# must be inside a git repo
git rev-parse --is-inside-work-tree >/dev/null 2>&1 || {
  echo "❌ Not inside a git repo. cd into the repo first."
  exit 1
}

REPO_ROOT="$(git rev-parse --show-toplevel)"
REPO_NAME="$(basename "$REPO_ROOT")"
RUN_TS="$(date +%Y%m%d_%H%M%S)"

ACTION_NAME="${1:-action_${RUN_TS}}"
PAGE_DIR="pages/${ACTION_NAME}"
PAGE_FILE="${PAGE_DIR}/index.html"

OWNER="Kris Watson"
PAYPAL_LINK="https://www.paypal.me/watsonkris611"
PRICE_USD="$(awk 'BEGIN{srand(); printf "%.2f", 49 + rand()*151}')"

mkdir -p "$PAGE_DIR"

cat > "$PAGE_FILE" <<EOF
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${ACTION_NAME} — ${REPO_NAME}</title>

  <script type="application/json" id="c13b0-token">
  {
    "repo": "${REPO_NAME}",
    "action": "${ACTION_NAME}",
    "created": "${RUN_TS}",
    "owner": "${OWNER}",
    "price_usd": "${PRICE_USD}",
    "paypal": "${PAYPAL_LINK}"
  }
  </script>

  <style>
    body { background:#0b1220; color:#e5f1ff; font-family:sans-serif; }
    .card { border:1px solid #1e2a44; padding:16px; margin:20px; border-radius:10px; }
  </style>
</head>
<body>

<h1>🧱 ${ACTION_NAME}</h1>
<p>Repo: ${REPO_NAME}</p>

<div class="card">
  <h2>👑 Ownership</h2>
  <p>Current owner: ${OWNER}</p>
  <p>Price: \$${PRICE_USD}</p>
  <a href="${PAYPAL_LINK}">💳 Purchase / Transfer</a>
</div>

<footer>
<p>🧱🍄⭐💲👑 Powered by Infinity</p>
</footer>

</body>
</html>
EOF

INDEX_FILE="index.html"

if [ ! -f "$INDEX_FILE" ]; then
  cat > "$INDEX_FILE" <<EOF
<!DOCTYPE html>
<html><body><h1>${REPO_NAME}</h1><ul></ul></body></html>
EOF
fi

if ! grep -q "${ACTION_NAME}" "$INDEX_FILE"; then
  sed -i "/<ul>/a \<li><a href=\"${PAGE_DIR}/\">${ACTION_NAME}</a></li>" "$INDEX_FILE"
fi

git add "$PAGE_DIR" "$INDEX_FILE"
git commit -m "🧱 Add C13B0 page: ${ACTION_NAME}" || true
git push || true

echo "👑 PAGE PUBLISHED → /${PAGE_DIR}/"


#!/usr/bin/env bash
# =============================================================================
# setup_cloud_sql.sh — Configura DB, user e IAM no Cloud SQL (alt-radar-pg)
# ✅ EXECUTADO COM SUCESSO em 2026-08-14
# Este script é documentação do processo. Infraestrutura já está ativa.
# =============================================================================
#
# RECURSOS CRIADOS:
#   Instância: alt-radar-pg (PostgreSQL 17, db-g1-small, europe-west3-a)
#   Base de dados: ag47_radar
#   Utilizador: ag47_radar_app
#   IAM: roles/cloudsql.client → 15974783507-compute@developer.gserviceaccount.com
#
# DATABASE_URL (unix socket via Cloud SQL Auth Proxy):
#   postgresql+asyncpg://ag47_radar_app:<PASSWORD>@/ag47_radar?host=/cloudsql/radar-altcoin:europe-west3:alt-radar-pg
#
# Para replicar ou recriar em novo ambiente:
# =============================================================================

set -euo pipefail

PROJECT="radar-altcoin"
REGION="europe-west3"
INSTANCE="alt-radar-pg"
DB_NAME="ag47_radar"
DB_USER="ag47_radar_app"
COMPUTE_SA="15974783507-compute@developer.gserviceaccount.com"
CONNECTION_NAME="${PROJECT}:${REGION}:${INSTANCE}"

echo "==> [1/5] Criar instância Cloud SQL PostgreSQL 17..."
gcloud sql instances create "${INSTANCE}" \
  --database-version=POSTGRES_17 \
  --tier=db-g1-small \
  --edition=ENTERPRISE \
  --region="${REGION}" \
  --storage-type=SSD \
  --storage-size=10GB \
  --no-backup \
  --project="${PROJECT}" 2>/dev/null || echo "   Já existe, a continuar."

echo "==> [2/5] Criar base de dados '${DB_NAME}'..."
gcloud sql databases create "${DB_NAME}" \
  --instance="${INSTANCE}" \
  --project="${PROJECT}" 2>/dev/null || echo "   Já existe, a continuar."

echo "==> [3/5] Criar utilizador de aplicação '${DB_USER}'..."
DB_PASSWORD=$(python3 -c "import secrets, string; print(''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32)))")
gcloud sql users create "${DB_USER}" \
  --instance="${INSTANCE}" \
  --password="${DB_PASSWORD}" \
  --project="${PROJECT}" 2>/dev/null || echo "   Utilizador já existe."

DATABASE_URL="postgresql+asyncpg://${DB_USER}:${DB_PASSWORD}@/${DB_NAME}?host=/cloudsql/${CONNECTION_NAME}"
echo ""
echo "   ✅ PASSWORD GERADA — guardar agora:"
echo "   AG47_DATABASE_URL=${DATABASE_URL}"
echo ""

echo "==> [4/5] Conceder roles/cloudsql.client ao Compute Service Account..."
gcloud projects add-iam-policy-binding "${PROJECT}" \
  --member="serviceAccount:${COMPUTE_SA}" \
  --role="roles/cloudsql.client" \
  --condition=None --quiet

echo "==> [5/5] Actualizar Cloud Run com Cloud SQL Auth Proxy e DATABASE_URL..."
gcloud run services update "alt-radar-api" \
  --project="${PROJECT}" \
  --region="${REGION}" \
  --add-cloudsql-instances="${CONNECTION_NAME}" \
  --update-env-vars="AG47_DATABASE_URL=${DATABASE_URL},AG47_ENVIRONMENT=production,AG47_DEMO_MODE=false,AG47_SCHEDULER_ENABLED=true"

echo ""
echo "✅ Cloud SQL configurado com sucesso!"
echo ""
echo "--- PRÓXIMOS PASSOS ---"
echo "Adicionar nos GitHub Secrets (Settings → Secrets → Actions):"
echo "  AG47_DATABASE_URL=${DATABASE_URL}"

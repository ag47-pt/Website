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
#   IAM: roles/cloudsql.client → service account dedicada de runtime
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
RUNTIME_SA="${AG47_GCP_RUNTIME_SERVICE_ACCOUNT:?Defina AG47_GCP_RUNTIME_SERVICE_ACCOUNT}"
DATABASE_SECRET="${AG47_DATABASE_SECRET_NAME:-alt-radar-database-url}"
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

echo "==> [4/5] Guardar DATABASE_URL no Secret Manager sem imprimir o valor..."
gcloud secrets describe "${DATABASE_SECRET}" \
  --project="${PROJECT}" >/dev/null 2>&1 || \
  gcloud secrets create "${DATABASE_SECRET}" \
    --replication-policy=automatic \
    --project="${PROJECT}"
printf '%s' "${DATABASE_URL}" | gcloud secrets versions add "${DATABASE_SECRET}" \
  --data-file=- \
  --project="${PROJECT}"

echo "==> [5/5] Conceder somente os acessos necessários à identidade de runtime..."
gcloud projects add-iam-policy-binding "${PROJECT}" \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/cloudsql.client" \
  --condition=None --quiet
gcloud secrets add-iam-policy-binding "${DATABASE_SECRET}" \
  --project="${PROJECT}" \
  --member="serviceAccount:${RUNTIME_SA}" \
  --role="roles/secretmanager.secretAccessor"

echo ""
echo "✅ Cloud SQL configurado com sucesso!"
echo ""
echo "--- PRÓXIMOS PASSOS ---"
echo "No environment GitHub alt-radar-production, configure apenas a referência:"
echo "  AG47_DATABASE_URL_SECRET=${DATABASE_SECRET}:latest"
echo "O workflow de release liga Cloud SQL/Secret Manager e provisiona os jobs; este script não faz deploy."

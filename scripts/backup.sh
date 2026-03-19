#!/bin/bash
# ============================================================
# Threadline Platform - MongoDB Backup Script
# Exports MongoDB database and uploads to AWS S3.
#
# Setup:
#   1. Install mongodump: https://www.mongodb.com/try/download/database-tools
#   2. Install AWS CLI: https://aws.amazon.com/cli/
#   3. Set required env variables (see .env.example)
#   4. Make executable: chmod +x scripts/backup.sh
#   5. Run manually: ./scripts/backup.sh
#      Or via cron (see bottom of file)
# ============================================================

set -e  # Exit immediately on any error

# ── Load env variables ────────────────────────────────────
if [ -f "$(dirname "$0")/../.env" ]; then
  export $(grep -v '^#' "$(dirname "$0")/../.env" | xargs)
fi

# ── Config ───────────────────────────────────────────────
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="/tmp/threadline-backup-${TIMESTAMP}"
ARCHIVE_NAME="threadline-backup-${TIMESTAMP}.tar.gz"
S3_PATH="s3://${S3_BUCKET_NAME}/backups/${ARCHIVE_NAME}"

# ── Validate required env vars ───────────────────────────
for VAR in MONGODB_URI AWS_ACCESS_KEY_ID AWS_SECRET_ACCESS_KEY AWS_REGION S3_BUCKET_NAME; do
  if [ -z "${!VAR}" ]; then
    echo "❌ Error: $VAR is not set"
    exit 1
  fi
done

echo "🚀 Starting backup at ${TIMESTAMP}..."

# ── Step 1: Export via mongodump ─────────────────────────
mkdir -p "$BACKUP_DIR"
echo "📦 Running mongodump..."
mongodump --uri="$MONGODB_URI" --out="$BACKUP_DIR" --quiet
echo "✅ mongodump complete"

# ── Step 2: Compress archive ─────────────────────────────
echo "🗜️  Compressing..."
tar -czf "/tmp/${ARCHIVE_NAME}" -C /tmp "threadline-backup-${TIMESTAMP}"
echo "✅ Compressed: ${ARCHIVE_NAME}"

# ── Step 3: Upload to S3 ─────────────────────────────────
echo "☁️  Uploading to S3..."
AWS_ACCESS_KEY_ID="$AWS_ACCESS_KEY_ID" \
AWS_SECRET_ACCESS_KEY="$AWS_SECRET_ACCESS_KEY" \
AWS_DEFAULT_REGION="$AWS_REGION" \
aws s3 cp "/tmp/${ARCHIVE_NAME}" "$S3_PATH"
echo "✅ Uploaded to ${S3_PATH}"

# ── Step 4: Cleanup local temp files ─────────────────────
rm -rf "$BACKUP_DIR" "/tmp/${ARCHIVE_NAME}"
echo "🧹 Cleaned up temp files"

echo "🎉 Backup complete: ${S3_PATH}"

# ============================================================
# CRON JOB SETUP (daily at 2 AM)
# Run: crontab -e
# Add this line:
#   0 2 * * * /bin/bash /path/to/threadline-platform/scripts/backup.sh >> /var/log/threadline-backup.log 2>&1
#
# RESTORE PROCEDURE:
#   1. Download from S3:
#      aws s3 cp s3://threadline-backups/backups/<archive>.tar.gz /tmp/
#   2. Extract:
#      tar -xzf /tmp/<archive>.tar.gz -C /tmp/
#   3. Restore:
#      mongorestore --uri="$MONGODB_URI" --drop /tmp/threadline-backup-<timestamp>/
#   The --drop flag drops existing collections before restoring.
# ============================================================

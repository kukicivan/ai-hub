PR Summary
==========

What changed:
- Centralized attachment classification and URL logic in `src/app/Utils/AttachmentUtil.php`.
- Refactored `AttachmentResource` to use `AttachmentUtil`.
- Updated `MessagePersistenceService::persistAttachment` to persist derived attachment metadata and URLs into DB.
- Added safe migrations:
  - `2025_09_30_000001_backfill_channel_id_message_threads.php` to add and backfill `channel_id` on `message_threads`.
  - `2025_09_30_000002_add_attachment_metadata.php` to add `file_type`, `is_previewable`, `download_url`, `preview_url` to `messaging_attachments`.
- Updated `MessageThread` and `MessagingAttachment` models to include new columns in `$fillable`.
- Added unit tests and integration test for persistMessage. Tests run in Docker and pass.

Why:
- Reduce duplicated logic for file classification across resources and services.
- Persisting derived attachment metadata simplifies client responses and speeds up queries.
- Backfilling `channel_id` aligns threads with channels and prevents ambiguous thread queries.

Notes:
- Editing original migrations is fine for new projects; for production, prefer a separate backfill migration (added here).
- The `backfill` migration attempts to change column nullability; if `doctrine/dbal` is not installed this step will be skipped silently.

How to run tests locally (inside project root):

```bash
# Run phpunit inside docker-compose PHP service
docker-compose -f docker-compose.yml run --rm backend_app sh -lc "cd /var/www && ./vendor/bin/phpunit --testdox"
```

Follow-ups:
- Add CI pipeline step that runs tests in the same container environment.
- Consider adding phpstan/psalm for static checks.

# CURL REQUESTS Linux
curl -X POST http://localhost:9001/api/sync/mail -H "Content-Type: application/json" -d '{}'
curl -X POST http://localhost:9001/api/sync/ai -H "Content-Type: application/json" -d '{}'
curl -X POST http://localhost:9001/api/sync/ai/123 -H "Content-Type: application/json" -d '{"force":true}'
curl -s http://localhost:9001/api/sync/status
curl -X POST http://localhost:9001/api/sync/cancel -H "Content-Type: application/json" -d '{"key":"ai"}'

# CURL REQUESTS Windows
curl.exe -X POST http://localhost:9001/api/sync/mail -H "Content-Type: application/json" -d "{}"
curl.exe -X POST http://localhost:9001/api/sync/ai -H "Content-Type: application/json" -d "{}"
curl.exe -X POST "http://localhost:9001/api/sync/ai/38" -H "Content-Type: application/json" -d '{\"force\":true}'
curl.exe -s http://localhost:9001/api/sync/status
curl.exe -X POST http://localhost:9001/api/sync/cancel -H "Content-Type: application/json" -d "{\"key\":\"ai\"}"

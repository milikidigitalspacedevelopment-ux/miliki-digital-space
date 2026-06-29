Phase 1 setup: Authentication + Users (Postgres)

Environment variables (create a `.env`):

- `PORT` - server port
- `DATABASE_URL` or `POSTGRES_URI` - Postgres connection string
- `JWT_ACCESS_SECRET` - access token secret
- `JWT_REFRESH_SECRET` - refresh token secret
- `JWT_ACCESS_EXPIRES` - e.g. `15m`
- `JWT_REFRESH_EXPIRES` - e.g. `7d`

To initialize DB (run on Postgres):

psql $DATABASE_URL -f database/schema.sql

Start server:

```bash
npm install
npm run dev
```

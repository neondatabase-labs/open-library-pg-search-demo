import { type NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) throw new Error(`DATABASE_URL environment variable not found.`)
const sql = neon(process.env.DATABASE_URL)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  const offset = searchParams.get('offset')
  if (!query) return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
  const results = await Promise.all([
    (async () => {
      const startTime = performance.now()
      const result = await sql(`select data from editions where key @@@ paradedb.match('data.title', $1) limit 12 offset ${offset};`, [query.toLowerCase()])
      const endTime = performance.now()
      return { data: result, time: endTime - startTime }
    })(),
    sql(`SELECT reltuples::bigint AS estimate FROM pg_class WHERE relname = 'editions'`),
    sql(`SELECT COUNT(*) AS total FROM editions WHERE key @@@ paradedb.match('data.title', $1);`, [query.toLowerCase()]),
  ])
  return NextResponse.json([results[0].data, results[1], results[2][0].total, results[0].time])
}

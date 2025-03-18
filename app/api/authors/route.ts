import { type NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) throw new Error(`DATABASE_URL environment variable not found.`)
const sql = neon(process.env.DATABASE_URL)

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  if (!query) return NextResponse.json({ error: 'Missing query parameter' }, { status: 400 })
  const results = await sql(`select data from authors where key @@@ paradedb.match('data.key', $1) limit 1;`, [query])
  try {
    return NextResponse.json(results[0].data)
  } catch (e: any) {
    const tmp = e.message || e.toString()
    console.log(tmp)
    return NextResponse.json({ name: '' })
  }
}

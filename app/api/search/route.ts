import { type NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL)
  throw new Error(`DATABASE_URL environment variable not found.`);
const sql = neon(process.env.DATABASE_URL);

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");
  const table = searchParams.get("table");
  const offset = searchParams.get("offset");
  if (!query || !table)
    return NextResponse.json(
      { error: "Missing query or table parameter" },
      { status: 400 }
    );
  const fieldNames = {
    authors: "data.name",
    editions: "data.title",
    works: "data.title",
  };
  const startTime = performance.now();
  const results = await Promise.all([
    sql(
      // @ts-ignore
      `select data from ${table} where key @@@ paradedb.term('${fieldNames[table]}', $1) limit 10 offset ${offset};`,
      [query]
    ),
    sql(
      `SELECT reltuples::bigint AS estimate FROM pg_class WHERE relname = '${table}'`
    ),
  ]);
  const endTime = performance.now();
  return NextResponse.json([results[0], results[1], endTime - startTime]);
}

import path from 'path'
import fs from 'fs'
import type { Database } from 'sql.js'

const DB_DIR = path.join(process.cwd(), '.data')
const DB_PATH = path.join(DB_DIR, 'resumes.sqlite')

let dbInstance: Database | null = null
let dbInitPromise: Promise<Database> | null = null

async function loadDb(): Promise<Database> {
  // sql.js's UMD build breaks when webpack statically bundles it into the RSC/route
  // module graph (its self-referential `module.exports` assumes a plain CJS host).
  // eval('require') keeps this an opaque runtime require so webpack leaves it external.
  // eslint-disable-next-line @typescript-eslint/no-var-requires, no-eval
  const initSqlJs = eval('require')('sql.js')
  const SQL = await initSqlJs({
    locateFile: (file: string) => path.join(process.cwd(), 'node_modules', 'sql.js', 'dist', file)
  })

  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }

  let db: Database
  if (fs.existsSync(DB_PATH)) {
    const fileBuffer = fs.readFileSync(DB_PATH)
    db = new SQL.Database(fileBuffer)
  } else {
    db = new SQL.Database()
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      session_id TEXT NOT NULL,
      data TEXT NOT NULL,
      share_id TEXT UNIQUE,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `)
  db.run(`CREATE INDEX IF NOT EXISTS idx_resumes_session ON resumes(session_id);`)
  db.run(`CREATE INDEX IF NOT EXISTS idx_resumes_share ON resumes(share_id);`)

  return db
}

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance
  if (!dbInitPromise) {
    dbInitPromise = loadDb().then(db => {
      dbInstance = db
      return db
    })
  }
  return dbInitPromise
}

export function persistDb(db: Database) {
  const data = db.export()
  const buffer = Buffer.from(data)
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }
  fs.writeFileSync(DB_PATH, buffer)
}

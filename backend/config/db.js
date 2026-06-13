const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Thiếu biến môi trường Supabase rồi đại ca ơi!");
}

const supabase = createClient(supabaseUrl || 'https://placeholder-url.supabase.co', supabaseKey || 'placeholder-key');

// --- COMPATIBILITY WRAPPER FOR DIRECT SQL QUERIES (Used by Existing Routes) ---
const sql = {
  Int: 'Int',
  VarChar: (len) => `VarChar(${len})`,
  NVarChar: (len) => `NVarChar(${len})`,
  MAX: 'MAX'
};

const connectionString = process.env.DATABASE_URL;
const dbConfig = {
  connectionString: connectionString || 'postgresql://postgres:postgres@localhost:5432/postgres',
  ssl: connectionString && !connectionString.includes('localhost') && !connectionString.includes('127.0.0.1')
    ? { rejectUnauthorized: false }
    : false
};

class PgRequest {
  constructor(pool) {
    this.pool = pool;
    this.inputs = {};
  }

  input(name, type, value) {
    this.inputs[name] = value;
    return this;
  }

  async query(sqlString) {
    let translatedSql = sqlString;
    const values = [];
    const paramMap = {};
    const keys = Object.keys(this.inputs).sort((a, b) => b.length - a.length);

    for (const key of keys) {
      const val = this.inputs[key];
      const regex = new RegExp(`@${key}\\b`, 'g');
      if (regex.test(translatedSql)) {
        if (!(key in paramMap)) {
          values.push(val);
          paramMap[key] = values.length;
        }
        translatedSql = translatedSql.replace(regex, `$${paramMap[key]}`);
      }
    }

    try {
      const res = await this.pool.query(translatedSql, values);
      return {
        recordset: res.rows,
        rowsAffected: [res.rowCount]
      };
    } catch (err) {
      console.error('❌ Error executing query on Supabase/PostgreSQL:', translatedSql);
      console.error('Parameters:', this.inputs);
      console.error(err);
      throw err;
    }
  }
}

class PgPoolWrapper {
  constructor(pgPool) {
    this.pgPool = pgPool;
  }

  request() {
    return new PgRequest(this.pgPool);
  }

  async query(sqlString) {
    return this.request().query(sqlString);
  }
}

let pool = null;
let poolWrapper = null;

async function connectDB() {
  if (pool) return poolWrapper;
  try {
    pool = new Pool(dbConfig);
    const res = await pool.query('SELECT NOW()');
    poolWrapper = new PgPoolWrapper(pool);
    console.log('✅ Kết nối PostgreSQL/Supabase thành công!');
    console.log(`   🕒 Giờ server: ${res.rows[0].now}`);
    return poolWrapper;
  } catch (error) {
    pool = null;
    poolWrapper = null;
    console.error('❌ Lỗi kết nối PostgreSQL/Supabase:', error.message);
    throw error;
  }
}

function getPool() {
  if (!poolWrapper) {
    throw new Error('Database chưa được kết nối! Hãy gọi connectDB() trước.');
  }
  return poolWrapper;
}

// Attach compatibility properties to the default exported supabase client
supabase.sql = sql;
supabase.connectDB = connectDB;
supabase.getPool = getPool;

module.exports = supabase;

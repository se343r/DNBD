const { Pool } = require('pg');

// SQL type mocks for compatibility with mssql calls in route files
const sql = {
  Int: 'Int',
  VarChar: (len) => `VarChar(${len})`,
  NVarChar: (len) => `NVarChar(${len})`,
  MAX: 'MAX'
};

// Database connection configuration for PostgreSQL
const connectionString = process.env.DATABASE_URL;

const dbConfig = {
  connectionString: connectionString || 'postgresql://postgres:postgres@localhost:5432/postgres',
  // Enable SSL automatically for remote databases (like Supabase)
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

    // Sort registered parameters by length descending to avoid partial substring match issues
    const keys = Object.keys(this.inputs).sort((a, b) => b.length - a.length);

    for (const key of keys) {
      const val = this.inputs[key];
      // Match '@parameterName' with word boundary
      const regex = new RegExp(`@${key}\\b`, 'g');
      
      if (regex.test(translatedSql)) {
        if (!(key in paramMap)) {
          values.push(val);
          paramMap[key] = values.length; // 1-based index for $1, $2, etc.
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

/**
 * Initialize connection to PostgreSQL (Supabase).
 */
async function connectDB() {
  if (pool) {
    return poolWrapper;
  }
  try {
    pool = new Pool(dbConfig);
    // Test database connection query
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

/**
 * Get the connection pool wrapper.
 */
function getPool() {
  if (!poolWrapper) {
    throw new Error('Database chưa được kết nối! Hãy gọi connectDB() trước.');
  }
  return poolWrapper;
}

module.exports = { sql, connectDB, getPool };

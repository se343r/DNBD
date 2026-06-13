const sql = require('mssql');

// Cấu hình kết nối SQL Server từ biến môi trường (.env)
const dbConfig = {
  server: process.env.DB_SERVER || 'localhost',
  database: process.env.DB_NAME || 'DanhNhanBacDau',
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '123456',
  port: parseInt(process.env.DB_PORT) || 1433,
  options: {
    encrypt: false,               // Tắt mã hóa cho kết nối localhost
    trustServerCertificate: true,  // Tin tưởng chứng chỉ tự ký (dev mode)
  },
  pool: {
    max: 10,    // Tối đa 10 kết nối đồng thời
    min: 0,
    idleTimeoutMillis: 30000, // Đóng kết nối nhàn rỗi sau 30 giây
  },
};

let pool = null;

/**
 * Khởi tạo kết nối đến SQL Server.
 * Gọi một lần khi server khởi động.
 */
async function connectDB() {
  if (pool) {
    return pool;
  }
  try {
    pool = await sql.connect(dbConfig);
    console.log('✅ Kết nối SQL Server thành công!');
    console.log(`   📦 Database: ${dbConfig.database}`);
    console.log(`   🖥️  Server:   ${dbConfig.server}:${dbConfig.port}`);
    return pool;
  } catch (error) {
    console.error('❌ Lỗi kết nối SQL Server:', error.message);
    throw error;
  }
}

/**
 * Lấy connection pool đã kết nối.
 * Dùng trong các route để thực thi truy vấn SQL.
 */
function getPool() {
  if (!pool) {
    throw new Error('Database chưa được kết nối! Hãy gọi connectDB() trước.');
  }
  return pool;
}

module.exports = { sql, connectDB, getPool };

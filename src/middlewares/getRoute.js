const { redisClient } = require("../configs/redis"); 
const pool = require("../configs/db"); 

module.exports = async function getRouteConfigs() {
    const ROUTES_CACHE_KEY = "cached:routes";
  
    try {
      const cached = await redisClient.get(ROUTES_CACHE_KEY);
  
      if (cached && cached !== '[]') {
        return JSON.parse(cached);
      }
    } catch (err) {
      console.error("⚠️ Redis get failed, fallback to DB:", err.message);
    }
  
    try {
      const { rows } = await pool.query(`
        SELECT id, name, path, method, description, protected, menu_id, action_type 
        FROM routes 
        WHERE status = 'approved'
      `);
  
      if (rows.length > 0) {
        try {
          await redisClient.set(ROUTES_CACHE_KEY, JSON.stringify(rows), {
            EX: 3600
          });
          console.log("✅ Routes cached to Redis");
        } catch (err) {
          console.error("⚠️ Redis set failed:", err.message);
        }
      }
  
      return rows;
    } catch (dbErr) {
      console.error("❌ DB query failed:", dbErr.message);
      return []; 
    }
  };
  

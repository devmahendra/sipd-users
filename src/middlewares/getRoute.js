const redisClient = require("../configs/redis"); 
const pool = require("../configs/db"); 
const ROUTES_CACHE_KEY = "cached:routes";

module.exports = async function getRouteConfigs() {
    // Check if routes are cached in Redis
    const cached = await redisClient.get(ROUTES_CACHE_KEY);

    // If cached data exists and is not an empty string, proceed
    if (cached && cached !== '[]') {
        return JSON.parse(cached); // If found in cache, return it
    }

    // Fetch data from the database if not found in cache or if cache is empty
    const { rows } = await pool.query(
      `SELECT id, name, path, method, description, protected, menu_id, action_type 
       FROM routes 
       WHERE status = 'approved'` // Only approved routes
    );

    // If routes are found in the database, store them in Redis
    if (rows.length > 0) {
        try {
            // Store the routes in Redis with a 1-hour expiration time
            await redisClient.set(ROUTES_CACHE_KEY, JSON.stringify(rows), {
                EX: 3600, // Expiry time: 1 hour
            });

            // Log to confirm the routes are set in Redis
            await redisClient.get(ROUTES_CACHE_KEY);

            return rows; // Return the fetched routes from the DB

        } catch (err) {
            console.error("❌ Failed to store routes in Redis:", err); // Log Redis set errors
        }
    } else {
        console.log("❌ No approved routes found in DB");
        return []; // Return empty array if no routes are found
    }
};

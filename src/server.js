require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const initializeRoutes = require('./routes/route');

const app = express();
const PORT = process.env.MS_PORT || 3000;

app.use(cors({
    origin: 'http://localhost:5000', 
    credentials: true 
}));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

(async () => {
    try {
        await initializeRoutes(app); 
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to initialize routes:", err);
        process.exit(1);
    }
})();


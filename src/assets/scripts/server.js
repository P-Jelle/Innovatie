import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());

app.get("/api/nike", async (req, res) => {
    try {
        const apiURL =
            "https://api.nike.com/product_feed/threads/v3/?anchor=0&count=50&filter=marketplace(NL)&filter=language(nl)&filter=upcoming(true)&filter=channelId(010794e5-35fe-4e32-aaff-cd2c74f89d61)&filter=exclusiveAccess(true,false)&sort=effectiveStartSellDateAsc";

        const response = await axios.get(apiURL);

        res.json(response.data);
    } catch (error) {
        console.error("Error fetching Nike API:", error.message);
        res.status(500).json({ error: "Failed to fetch Nike API data" });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
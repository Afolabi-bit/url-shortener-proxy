const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // <-- This is important for JSON payloads

app.post("/shorten", async (req, res) => {
	try {
		const { url } = req.body;

		if (!url) {
			return res.status(400).json({ error: "Missing 'url' parameter" });
		}

		const response = await axios.post(
			"https://cleanuri.com/api/v1/shorten",
			new URLSearchParams({ url }).toString(),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);

		res.json(response.data);
	} catch (err) {
		console.error("Proxy error:", err?.response?.data || err.message);
		res.status(500).json({
			error: "CleanURI request failed",
			detail: err?.response?.data || err.message,
		});
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));

const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS for all origins
app.use(cors());

// Alternatively, specify only your frontend's origin
// app.use(cors({ origin: "http://localhost:3000" }));

// Other middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your routes
app.use("/verificator", require("./routes/verificator"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

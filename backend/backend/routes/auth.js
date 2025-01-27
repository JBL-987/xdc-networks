const express = require("express");
const { Magic } = require("@magic-sdk/admin");
const router = express.Router();

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

router.post("/verify", async (req, res) => {
  try {
    const { didToken, email } = req.body;

    const metadata = await magic.users.getMetadataByToken(didToken);
    if (metadata.email !== email) {
      return res.status(401).json({ error: "Unauthorized user" });
    }

    const role = email.includes("@admin.com") ? "admin" : "user";

    res.status(200).json({ message: "User verified", email, role });
  } catch (err) {
    console.error("Error verifying user:", err);
    res.status(500).json({ error: "Verification failed" });
  }
});

module.exports = router;

const express = require("express");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Ajv = require("ajv");

const router = express.Router();
const generatedDir = path.join(__dirname, "../generated");

if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir, { recursive: true });
}

function computeHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return crypto.createHash("sha256").update(fileBuffer).digest("hex");
}

router.post("/", async (req, res) => {
  try {
    const { network, forms } = req.body;
    if (!forms || !Array.isArray(forms) || forms.length === 0) {
      return res.status(400).json({ error: "Forms array is missing or invalid" });
    }

    const form = forms[0];
    const { name: templateName, data, schema, defaults } = form;
    if (!templateName || !data) {
      return res.status(400).json({ error: "Template name or data missing" });
    }

    const ajv = new Ajv();
    const validate = ajv.compile(schema);
    if (!validate(data)) {
      return res.status(400).json({ error: "Invalid data", details: validate.errors });
    }

    const document = {
      ...data,
      proof: { timestamp: new Date().toISOString() },
      template: defaults?.$template,
      issuers: defaults?.issuers,
      network,
    };
 
    const fileName = `document-${Date.now()}.tt`;
    const filePath = path.join(generatedDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(document, null, 2));

    const documentHash = computeHash(filePath);

    res.json({ message: "Document created", filePath, documentHash });
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

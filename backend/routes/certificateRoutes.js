const express = require("express");
const router = express.Router();
const {
  getAllCertificates,
  addCertificate,
  deleteCertificate,
} = require("../controller/certificateController");

// Routes for certificates
router.get("/", getAllCertificates);
router.post("/", addCertificate);
router.delete("/:id", deleteCertificate);

module.exports = router;

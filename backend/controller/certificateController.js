const Certificate = require("../models/Certificate");

// Fetch all certificates
const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.status(200).json({
      message: "Certificates retrieved successfully",
      certificates,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching certificates",
      error: error.message,
    });
  }
};

// Add a new certificate
const addCertificate = async (req, res) => {
  try {
    const { imageUrl, courseName } = req.body;

    if (!imageUrl || !courseName) {
      return res
        .status(400)
        .json({ message: "Image URL and Course Name are required" });
    }

    const newCertificate = new Certificate({ imageUrl, courseName });
    await newCertificate.save();

    res.status(201).json({
      message: "Certificate added successfully",
      certificate: newCertificate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding certificate",
      error: error.message,
    });
  }
};

// Delete a certificate by its ID
const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCertificate = await Certificate.findByIdAndDelete(id);
    if (!deletedCertificate) {
      return res.status(404).json({ message: "Certificate not found" });
    }

    res.status(200).json({
      message: "Certificate deleted successfully",
      certificate: deletedCertificate,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting certificate",
      error: error.message,
    });
  }
};

module.exports = {
  getAllCertificates,
  addCertificate,
  deleteCertificate,
};

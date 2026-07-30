exports.generateCertificate = async (req, res) => {
  try {
    const { userName, partnerName, skillName, completedDate } = req.body;

    if (!userName || !partnerName || !skillName) {
      return res.status(400).json({ message: "Missing certificate details" });
    }

    res.json({
      success: true,
      certificate: {
        userName,
        partnerName,
        skillName,
        completedDate: completedDate || new Date().toLocaleDateString(),
        title: "Skill Exchange Completion Certificate"
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const { skillOffered, skillWanted } = req.body;

    const recommendations = [];

    if (skillOffered) {
      recommendations.push(`People interested in ${skillOffered}`);
    }

    if (skillWanted) {
      recommendations.push(`Suggested learning path for ${skillWanted}`);
      recommendations.push(`Users who can teach ${skillWanted}`);
    }

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendations };

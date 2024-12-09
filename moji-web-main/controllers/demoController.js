const demoController = {
  getTestMessage: (req, res) => {
    res.status(200).json({ message: "Test message received successfully!" });
    console.log("success");
  },

  createTestData: (req, res) => {
    const { data } = req.body;
    if (!data) {
      return res.status(400).json({ error: "No data provided!" });
    }
    res.status(201).json({ message: "Data created successfully!", data });
  },
};

module.exports = demoController;

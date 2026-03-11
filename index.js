const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Aurora Bot is running 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Aurora Bot running on port " + PORT);
});

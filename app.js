const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');

const indexRoute = require("./routes/index")

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => { })
  .catch(console.error);

  
app.use(express.json())

app.use(cors());

app.use("/", indexRoute);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require('./middlewares/error-handler')
const indexRoute = require("./routes/index")

require('dotenv').config();

const app = express();
const { PORT = 3001 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => { })
  .catch(console.error);

  
app.use(express.json())

app.use(cors());

app.use(requestLogger);
app.use("/", indexRoute);

app.use(errors());
app.use(errorHandler);

app.use(errorLogger);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const express = require('express');
const mongoose = require("mongoose");
const indexRoute = require("./routes/index")

const { PORT = 3001 } = process.env;
const app = express();



mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => { })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: '66b3fb014b963aff69801f82'// paste the _id of the test user created in the previous step
  };
  next();
});

app.use(express.json())
app.use('/', indexRoute);

app.listen(PORT, () => {
  // console.log(`Server is running on port ${PORT}`);
  // console.log('this is WORKING')
});

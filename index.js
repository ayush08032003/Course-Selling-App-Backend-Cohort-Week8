require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const { DATABASE_CONNECTION_URL } = require("./db/db.js");
const port = parseInt(process.env.PORT) || 3000;

app.use(express.json());

(async () => {
  console.log("Connecting to database...");
  await mongoose.connect(DATABASE_CONNECTION_URL);
  console.log("Connected to database...");

  app.listen(port, () => {
    console.log("SERVER is running on " + port);
  });
})();

const { userRouter } = require("./routes/user.js"); // make sure to have same name as of export in the user.js module.
const { courseRouter } = require("./routes/course.js");
const { adminRouter } = require("./routes/admin.js");

app.use("/user", userRouter);
app.use("/course", courseRouter);
app.use("/admin", adminRouter);

/*
The traditional way of routing can have so much code in one place which can be hard to maintain.
So, one can use a ugly way of routing by creating functions and making the main index.js to call
all the functions. 

There's one better way to do routing in express. using Router. 

TODO: make sure to have app.listen starts after the connection is made to mongodb. 
TODO: check this out. https://github.com/processing/p5.js-web-editor/tree/develop/server
*/

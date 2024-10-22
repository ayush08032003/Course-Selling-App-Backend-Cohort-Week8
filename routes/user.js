// /user - domain
const { Router } = require("express");
const userRouter = Router();
const { z } = require("zod");
const { userModel, courseModel, purchaseModel } = require("../db/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const noOfRounds = parseInt(process.env.NO_OF_ROUNDS);
const { authUser, JWT_USER_PASSWORD } = require("../auth/authUser.js");

userRouter.post("/signup", async (req, res) => {
  // this is the singup endpoint, where the user has not logedin even for once.
  const requiredBody = z.object({
    email: z
      .string()
      .email()
      .min(3, { message: "Too short username" })
      .max(30, { message: "Too Long username" }),
    password: z
      .string()
      .min(5, { message: "Too short Password" })
      .max(30, { message: "Too Long Password" }),
    firstName: z
      .string()
      .min(3, { message: "Too short firstname" })
      .max(30, { message: "Too Long firstName" }),
    lastName: z
      .string()
      .min(3, { message: "Too short lastName" })
      .max(30, { message: "Too Long lastName" })
      .optional(),
  });

  const { data, success, error } = requiredBody.safeParse(req.body);
  if (!success) {
    const problem = error.issues;
    res.json({
      problem: problem,
    });
    return;
  }

  const { email, password, firstName, lastName } = data;
  const hashedPassword = await bcrypt.hash(password, noOfRounds); //generate a hashpassword

  userModel
    .create({ email, hashedPassword, firstName, lastName })
    .then(() => {
      res
        .status(200)
        .json({ message: "User Signed up Successfully.! Now Login.." });
      return;
    })
    .catch((error) => {
      if (error.errorResponse.code === 11000) {
        res.status(400).json({
          message: error.errorResponse.errmsg,
        });
        return;
      }

      // console.log(error);
      res.status(400).json({
        message: "Something Went Wrong..!",
        error,
      });
      return;
    });

  // res.json({
  //   message: "User Signup Endpoint",
  // });
});

userRouter.post("/signin", async (req, res) => {
  // this is the login endoint, where the user has already have data
  const requiredBody = z.object({
    email: z
      .string()
      .email()
      .min(3, { message: "Too short username" })
      .max(30, { message: "Too Long username" }),
    password: z
      .string()
      .min(5, { message: "Too short Password" })
      .max(30, { message: "Too Long Password" }),
  });

  const { data, success, error } = requiredBody.safeParse(req.body);
  if (!success) {
    const problem = error.issues;
    res.json({
      problem: problem,
    });
    return;
  }

  const { email, password } = data;

  try {
    const userData = await userModel.findOne({ email });

    if (userData === null) {
      // if the data is not present in the database it will throw an error..!
      res.status(403).json({
        message: "Unauthorized User - Email doesnot exits.!",
      });
      return;
    }

    const match = await bcrypt.compare(password, userData.hashedPassword);

    if (match) {
      // pasword is matched with hashed Password stored in database

      // do cokie based logic here in future.
      const token = jwt.sign(
        { userId: userData._id.toString() },
        JWT_USER_PASSWORD
      );

      res.status(200).json({
        message: `Welcome ${userData.firstName}`,
        token,
      });
      return;
    } else {
      res.status(403).json({
        message: "Unauthorized User - Password doesnot exits.!",
      });
      return;
    }
  } catch (error) {
    res.status(400).json({
      message: "Something Went Wrong.. :: userRouter post /signin",
      error,
    });
    return;
  }
});

userRouter.get("/purchase", authUser, async (req, res) => {
  // here user can see the details of all the courses, he/she has bought..
  const userId = req.userId;
  // console.log(userID);
  purchaseModel
    .find({ userId: userId })
    .then((data) => {
      // data wil give us courseid.
      res.status(200).json({
        message: "All Purchased Courses",
        data,
      });
      return;
    })
    .catch((error) => {
      res.status(400).json({
        message: "Something Went Wrong.. :: userRouter get /purchase",
        error,
      });
      return;
    });
});

module.exports = { userRouter };

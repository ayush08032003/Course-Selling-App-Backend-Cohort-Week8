const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db/db.js");
const { z } = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const noOfRounds = parseInt(process.env.NO_OF_ROUNDS);
const { authAdmin, JWT_ADMIN_PASSWORD } = require("../auth/authAdmin.js");

adminRouter.post("/signup", async (req, res) => {
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
  }); // zod schema define for body contents passed by the user.

  const { data, success, error } = requiredBody.safeParse(req.body);

  if (!success) {
    const problem = error.issues;
    res.json({
      problem: problem,
    });
    return;
  }

  const { email, password, firstName, lastName } = data;
  const hashedPassword = await bcrypt.hash(password, noOfRounds); // this will generate a hashedPassword

  adminModel
    .create({ email, hashedPassword, firstName, lastName })
    .then(() => {
      res.status(200).json({
        message: "Admin Signed Up Successfully..! Now Login",
      });
    })
    .catch((error) => {
      if (error.errorResponse.code === 11000) {
        res.status(409).json({
          message: "Admin Already Been signedup..!",
          error: error.errorResponse.errmsg,
        });
        return;
      }

      res.status(400).json({
        message: "Something Went Wrong..!",
        error: error,
      });
    });

  // try not to use this method as the better option is to use safe parse method..!
  // try {
  //   const parsedBody = requiredBody.parse(req.body); // this .parse functions throws an error..!
  //   // console.log(parsedBody);
  //   res.json({
  //     data: parsedBody,
  //     message: "Admin signup endpoint",
  //   });
  // } catch (error) {
  //   const err = error.issues.map((err) => err.message);
  //   res.status(400).json({
  //     error: err,
  //   });
  // }
});

adminRouter.post("/signin", async (req, res) => {
  // declare the schema for the request body..!
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

  const { data, error, success } = requiredBody.safeParse(req.body);

  if (!success) {
    const problem = error.issues;
    res.json({
      problem: problem,
    });
    return;
  }

  // till here zod work is over..

  const { email, password } = data;

  try {
    const adminData = await adminModel.findOne({ email });

    if (adminData === null) {
      // if the data is not present in the database it will throw an error..!
      res.status(403).json({
        message: "Unauthorized Admin - Email doesnot exits.!",
      });
      return;
    }

    const match = await bcrypt.compare(password, adminData.hashedPassword);
    if (match) {
      // when matching is done.. ✅ assign a jwt token using JWT_SECRET which contains the _id.

      const token = jwt.sign(
        { adminId: adminData._id.toString() },
        JWT_ADMIN_PASSWORD
      );

      res.json({
        message: `Welcome ${adminData.firstName}`,
        token: token,
      });
      return;
    } else {
      res.status(403).json({
        message: "Unauthorized Admin - Passoword doesnot Match.!",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error :: adminRouter post /signin",
      error,
    });
    return;
  }
});

adminRouter.post("/course", authAdmin, async (req, res) => {
  // used for creating course

  const adminId = req.adminId;

  const requiredBody = z.object({
    title: z.string(),
    description: z
      .string()
      .min(3, { message: "Too short description" })
      .max(300, { message: "Too Long description" }),
    imageUrl: z.string(),
    price: z.number(),
  });

  const { data, success, error } = requiredBody.safeParse(req.body);

  if (!success) {
    const problem = error.issues;
    res.json({
      problem: problem,
    });
    return;
  }

  // console.log(data);

  const { title, description, imageUrl, price } = data;

  await courseModel
    .create({
      title,
      description,
      imageUrl,
      price,
      creatorId: adminId,
    })
    .then((data) => {
      res.status(200).json({
        message: "Course Created Successfully",
        CourseDetails: data,
      });
      return;
    })
    .catch((error) => {
      res.status(400).json({
        message: "Something Went Wrong..!",
        error,
      });
      return;
    });
});

adminRouter.put("/course", authAdmin, async (req, res) => {
  // used for update course content, they need to send us everything..!
  const adminId = req.adminId;

  const requiredBody = z.object({
    courseId: z.string(),
    title: z.string(),
    description: z
      .string()
      .min(3, { message: "Too short description" })
      .max(300, { message: "Too Long description" }),
    imageUrl: z.string(),
    price: z.number(),
  });

  const { data, success, error } = requiredBody.safeParse(req.body);

  if (!success) {
    const problem = error.issues;
    res.json({
      problem: problem,
    });
    return;
  }

  const { courseId, title, description, imageUrl, price } = data;

  try {
    const newData = await courseModel.findOneAndUpdate(
      {
        // this one is filter, and createrID is neccessary as this determine whether this course is actually belongs to a particular admin or not.
        _id: courseId,
        creatorId: adminId,
      },
      { title, description, imageUrl, price }, // updating the data
      { new: true } // giving back new data.
    );

    if (newData) {
      res.status(200).json({
        message: "Course Updated Successfully",
        NewCourseDetails: newData,
      });
      return;
    } else {
      res.status(401).json({
        message: "You are not Authorized to update this course",
      });
      return;
    }
  } catch (error) {
    res.status(400).json({
      message: "Something Went Wrong.. :: adminRouter put /course",
      error,
    });
    return;
  }
});

adminRouter.get("/courses/bulk", authAdmin, async (req, res) => {
  // used for getting all courses
  const adminId = req.adminId;

  try {
    const allCourse = await courseModel.find({ creatorId: adminId });
    if (allCourse.length === 0) {
      res.json({
        message: "No Course Found",
      });
      return;
    }
    res.json({
      message: "All Courses By You..!",
      allCourse: allCourse,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something Went Wrong.. :: adminRouter get /courses/bulk",
      error,
    });
    return;
  }
});

adminRouter.delete("/course", authAdmin, async (req, res) => {
  // used for deleting course
  const adminId = req.adminId;
  const requiredBody = z.object({
    courseId: z.string(),
  });

  const { data, success, error } = requiredBody.safeParse(req.body);

  if (!success) {
    const problem = error.issues;
    res.json({
      problem: problem,
    });
    return;
  }

  // console.log(data);

  const { courseId } = data;
  // const findCourse = null;
  try {
    const findCourse = await courseModel.findOneAndDelete({
      _id: courseId,
      creatorId: adminId,
    });

    if (!findCourse) {
      res.status(401).json({
        message: "You are not Authorized to delete this course",
      });
      return;
    }

    res.json({
      message: "Course Deleted Successfully",
      DeletedCourse: findCourse,
    });
  } catch (error) {
    res.status(400).json({
      message: "Something Went Wrong.. :: adminRouter delete /course",
      error,
    });
    return;
  }
});

module.exports = { adminRouter };

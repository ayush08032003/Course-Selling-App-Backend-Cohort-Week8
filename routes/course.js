// /course - domain
const { Router } = require("express");
const courseRouter = Router();
const {
  courseModel,
  purchaseModel,
  userModel,
  ObjectId,
} = require("../db/db.js");
const { authUser } = require("../auth/authUser.js");

courseRouter.get("/", async (req, res) => {
  // this will show all the courses available in the server..! no middleware.

  try {
    const allCourse = await courseModel.find();

    res.json({
      message: "All Courses Endpoint",
      AllCourses: allCourse,
    });
  } catch (error) {
    res.json({
      message: "Something Went Wrong..! courseRoute :: get /",
      error: error,
    });
  }
});

courseRouter.post("/purchase", authUser, async (req, res) => {
  // you need to pay money here..!
  // here, you build a relationship between courseId and userId - purchase is done.. wlll have a middleware.
  const userId = req.userId;
  const { courseId } = req.body;

  try {
    const findCourse = await purchaseModel.find({
      courseId: courseId,
      userId: userId,
    });

    // console.log(findCourse);

    if (findCourse.length != 0) {
      res.json({
        message: "Course Already Purchased",
      });
      return;
    }

    // here course is not purchased till now.
    const newPurchase = await purchaseModel.create({
      courseId: courseId,
      userId: userId,
    });

    const userName = await userModel.findOne({ _id: userId });
    const { firstName, lastName } = userName;

    res.json({
      message: `Course Purchase Done by ${firstName} ${
        lastName === undefined ? "" : lastName
      }`,
      details: newPurchase,
    });
  } catch (error) {
    res.json({
      message: "Something Went Wrong..! courseRoute :: post /purchase",
      error: error,
    });
  }
});

courseRouter.get("/preview/:courseId", async (req, res) => {
  // gets the detail of a particular course
  const { courseId } = req.params;

  try {
    const courseDetails = await courseModel.find({ _id: courseId });

    if (courseDetails.length === 0) {
      res.json({
        message: "No Course Found",
      });
      return;
    }
    // console.log(courseId);

    res.json({
      message: "Course Preview",
      courseDetails,
    });
  } catch (error) {
    res.json({
      message: "Something Went Wrong..! courseRoute :: get /preview/:courseId",
      error: error,
    });
  }
});

module.exports = { courseRouter };

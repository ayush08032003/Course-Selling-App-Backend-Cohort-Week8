const mongoose = require("mongoose");
const { Schema } = mongoose;
const ObjectId = mongoose.Types.ObjectId;
const DATABASE_CONNECTION_URL = String(process.env.DATABASE_CONNECTION_URL);

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: undefined },
});

const adminSchema = new Schema({
  email: { type: String, required: true, unique: true },
  hashedPassword: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: undefined },
});

const courseSchema = new Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  price: { type: Number, required: true },
  imageUrl: { type: String },
  creatorId: { type: ObjectId },
});

const purchaseSchema = new Schema({
  courseId: { type: ObjectId, required: true},
  userId: { type: ObjectId, required: true }, 
});

// this mongoose model will create a collection named "users"
const userModel = mongoose.model("users", userSchema);
const adminModel = mongoose.model("admins", adminSchema);
const courseModel = mongoose.model("courses", courseSchema);
const purchaseModel = mongoose.model("purchases", purchaseSchema);

module.exports = {
  userModel,
  adminModel,
  courseModel,
  purchaseModel,
  DATABASE_CONNECTION_URL,
  ObjectId
};
/*
------------ SCHEMAS -----------------

Users
—id => Objectld
email => String
password => String
firstName => string
lastName => string

Admin
_id => Objectld
email => String
password => String
firstName => string
lastName => string

Course
—id => Objectld
title => String,
description => String,
price => number,
imageUrl => string
creatorld => ObjectId

Purchases
—id => Objectld
courseld => Objectld
userld Objectld

------------------- RELATIONS ----------------
Course.creatorld = Admin._id
Purchases.courseld = Course._id
*/

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

const User = require("../../models/User");

global.fetch = require("node-fetch");
global.navigator = () => null;
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
const poolData = {
  UserPoolId: "us-east-1_FNXemQy5q", // Your user pool id here
  ClientId: "1idaoktd6e022ruk1ohpuj9436" // Your client id here
};

const pool_region = "us-east-1";
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post(
  "/",
  [
    check("name", "Name is required")
      .not()
      .isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      console.log("I am here!");

      const { name, email, password } = req.body;
      let attributeList = [];

      console.log("I am here!2");

      attributeList.push(
        new AmazonCognitoIdentity.CognitoUserAttribute({
          Name: "name",
          Value: name
        })
      );

      console.log("I am here!3");

      let newUser;

      userPool.signUp(email, password, attributeList, null, (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send(err);
          return;
        }
        newUser = result.user;
        return res.json(newUser);
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;

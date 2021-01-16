/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

//hardcoded data
const data = {
  huntItems: [],
  hunts: [],
};

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }

  res.send(req.user);
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|
router.post("/createhunt", (req, res) => {
  const huntId = `huntId_${Math.random()*10000}`;
  const newHunt = {
    _id: huntId,
    creatorId: req.body.creatorId,
    title: req.body.title,
    description: req.body.description
  };

  data.hunts.push(newHunt);
  data.huntItems = [...data.huntItems,...req.body.huntItems.map((huntItem) => ({
    huntId: huntId,
    question: huntItem.question,
    answer: huntItem.answer,
  }))];

});
// router.get("/huntitem", (req, res) => {
//   res.send(data.huntItems);
// });

// router.post("/huntitem", (req, res) => {
//   const newHuntItem = {
//     _id: req.body._id,
//     question: req.body.question,
//     answer: req.body.answer
//   };

//   data.huntItems.push(newHuntItem);
//   res.send(newHuntItem);

// });

router.get("/hunt", (req, res) => {
  res.send(data.hunts);
});

// router.post("/hunt", (req, res) => {
//   const newHunt = {
//     _id: req.body._id,
//     title: req.body.title,
//     description: req.body.description,
//     huntItems: req.body.huntItems
//   };

//   data.scavengerHunts.push(newHunt);
//   res.send(newHunt);
// });


// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;

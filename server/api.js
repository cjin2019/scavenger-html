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
const Hunt = require("./models/hunt");
const HuntItem = require("./models/huntitem");

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
  let huntId = null;

  const newHunt = new Hunt({
    creatorId: req.body.creatorId,
    title: req.body.title,
    description: req.body.description
  });

  newHunt.save().then((hunt) => {
    huntId = hunt._id;

    const huntItems = req.body.huntItems;
    for(let index = 0; index < huntItems.length; index++){
      const newHuntItem = new HuntItem({
        huntId: huntId,
        question: huntItems[index].question,
        answer: huntItems[index].answer
      });

      newHuntItem.save();
    }

  });
  
});

router.get("/hunt", (req, res) => {
  Hunt.find({ creatorId: req.query.creatorId}).then((hunt) => {
    res.send(hunt);
  });
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

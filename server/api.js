/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for your server.
|
*/

const express = require("express");

// import models so we can interact with the database
const User = require("./models/user");
const Hunt = require("./models/hunt");
const HuntItem = require("./models/huntitem");
const CreatePage = require("./models/createpage");

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

router.get("/savedhuntitem", (req, res) => {
  let query = {"createId": req.query.createId};
  HuntItem.find(query).then((huntitems) => {
    res.send(huntitems);
  });
});

router.post("/savedhuntitem", (req, res) => {
  const newHuntItem = new HuntItem({
    huntId: "",
    createId: req.body.createId,
    question: req.body.question,
    answer: req. body.answer
  });

  newHuntItem.save().then((huntitem) => {res.send(huntitem);});
});

router.get("/createpage", (req, res) => {
  let query = {"userId": req.query.userId}; 
  CreatePage.find(query).then((createpage) => {
    res.send(createpage);});
});

router.post("/createpage", (req, res) => {
  let query = {"userId": req.body.userId};
  if(req.body.action === "delete"){
    CreatePage.deleteOne(query).then(() => {
      console.log("deleted 1 doc");
      res.send({msg: "deleted"});
    });
  } else {
    newCreatePage = new CreatePage({
      userId: req.body.userId,
    });

    newCreatePage.save().then((createpage) => {
      res.send(createpage);
    });

  }
  
});

router.post("/createhunt", (req, res) => {
  let huntId = null;

  const newHunt = new Hunt({
    creatorId: req.body.creatorId,
    title: req.body.title,
    description: req.body.description
  });

  newHunt.save().then((hunt) => {
    huntId = hunt._id;
    console.log(huntId);
    //update hunt item huntId
    HuntItem.updateMany({createId: req.body.createId}, 
                        {$set: {
                          huntId: huntId,
                        },}
      ).then(() => {
        console.log("updated items");
        res.send({succeed: true});
      });

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

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
const Game = require("./models/game");
const Player = require("./models/player");
const SubmissionItem = require("./models/submissionitem");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");
const player = require("./models/player");
const { mongo } = require("mongoose");


// writing helper function

/**
 * @param {String} ids the list of ids to retrieve 
 * @returns pipeline for aggregate function
 */
function getOrderedHuntItems(ids) {

  let pipeline = [
    {$match: {"_id": {$in: ids}}},
    {$addFields: {"__order": {$indexOfArray: [ids, "$_id" ]}}},
    {$sort: {"__order": 1}}
   ];

  console.log("Got the pipeline set");
  return pipeline;
}

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

router.get("/submission", (req, res) => {
  const query = {
    playerId: req.query.playerId,
    huntItemId: req.query.huntItemId,
    gameId: req.query.gameId,
  }
  SubmissionItem.findOne(query).then((submissionItem) => {
    //if no submission yet, send a msg: NO SUBMISSION
    if(submissionItem === null){
      res.send({msg: "NO SUBMISSION"});
    } else{
      res.send(submissionItem);
    }
  });
});

router.post("/submission", (req, res) => {
  const filter = {
    playerId: req.body.playerId,
    huntItemId: req.body.huntItemId,
    gameId: req.body.gameId,
  };

  const update = { $set: {"currentSubmission": req.body.currentSubmission,
                          "isCorrect": req.body.isCorrect === "true"} };
  SubmissionItem.updateOne(filter, update, {upsert: true}).then((submissionItem) => {
    res.send(submissionItem);
  });
});

router.post("/game", (req, res) => {
  if(req.body.action && req.body.action === "delete"){
    Game.findByIdAndDelete(req.body.gameId).then(() => {res.send({});});
  } else{
    Hunt.findById(req.body.huntId).then((hunt) => {
      HuntItem.find({huntId: hunt._id}).then((huntItems) => {
        const ids = huntItems.map((huntItem) => (huntItem._id));
        const newGame = new Game({
          huntId: hunt._id,
          creatorId: req.body.creatorId,
          orderHuntItemIds: ids,
        });
        newGame.save().then((game) => {res.send({game});})
      });
    });
  }
});

router.get("/game", (req, res) => {
  if(req.query.creatorId){
    Game.findOne({creatorId: req.query.creatorId}).then((game) => {
      res.send(game);
    });
  } else {
    Game.findById(req.query.gameId).then((game) => {
      console.log("Server got game: " + game);
      res.send(game);
    });
  }
  
});

router.post("/deleteplayer", (req, res) => {
  Player.findByIdAndDelete(req.body.playerId).then(() => {
    res.send({msg: "DELETED PLAYER"});
  });
});

router.post("/player", (req, res) => {
  console.log(req.body);
  if(req.body.playerId){
    if(req.body.itemIndex !== undefined){
      Player.findByIdAndUpdate(req.body.playerId, 
                                {$set: {
                                  currentHuntItemIndex: req.body.itemIndex,
                                }},
                                {
                                  new: true,
                                }).then((player)=> { res.send(player);});
    }
  } else {
    const newPlayer = new Player({
      gameId: req.body.gameId,
      userInfo: req.body.user,
      currentHuntItemIndex: -1, //hard code to -1 for now
      numCorrect: 0,
    });
    newPlayer.save().then(() => {res.send({});});
  }


});

router.get("/player", (req, res) => {
  const query = {"userInfo._id": req.query._id};
  Player.findOne(query).then((player) => {
    console.log("Server got player: " + player);
    res.send(player);
  });
});


router.get("/savedhuntitem", (req, res) => {
  let query = {"huntId": req.query.huntId};
  HuntItem.find(query).then((huntitems) => {
    res.send(huntitems);
  });
});

router.post("/savedhuntitem", (req, res) => {
  const newHuntItem = new HuntItem({
    huntId: req.body.huntId, 
    question: req.body.question,
    answer: req.body.answer
  });

  newHuntItem.save().then((huntitem) => {res.send(huntitem);});
});

router.get("/hunt", (req, res) => {
  if(req.query.creatorId){
    const query = {
      creatorId: req.query.creatorId,
      isFinalized: req.query.isFinalized === "true",
    };
    console.log(query);
    Hunt.find(query).then((hunts) => {
      console.log(hunts);
      res.send(hunts);
    });
  } else {
    Hunt.findById(req.query.huntId).then((hunt) => {
      res.send(hunt);
    })
  }
});

router.post("/hunt", (req, res) => {
  if(req.body.action === "add"){
    newHunt = new Hunt({
      creatorId: req.body.creatorId,
      title: "",
      description: "",
      isFinalized: false,
    });
    newHunt.save().then((hunt) => {
      res.send(hunt);
    });
  } else if (req.body.action === "delete") {
    Hunt.findByIdAndDelete(req.body.huntId).then(() => {
      res.send({msg: "DELETED HUNT FROM DATABASE"});
    });
  } else {
    const update = { $set: {"title": req.body.title,
                            "description": req.body.description,
                            "isFinalized": true, 
                          } };
    Hunt.findByIdAndUpdate(req.body.huntId, update).then(() => {
      res.send({msg: "UPDATED HUNT TO VIEWED BY OTHER USERS"});
    });
  }
});

router.get("/playhuntitems", (req, res) => {
  console.log(req.query.huntItemIds.split(","));
  const ids = req.query.huntItemIds.split(",").map((idString) =>(mongo.ObjectID(idString)));
  console.log(ids);
  const pipeline = getOrderedHuntItems(ids);
  console.log("This is the pipeline: " + pipeline);
  HuntItem.aggregate(pipeline).then((huntitems) => {
    const huntItemsResponse = huntitems.map((huntitem) => ({
      _id: huntitem._id,
      question: huntitem.question,
      answer: huntitem.answer,
    }));
    console.log("Got hunt items: " + huntItemsResponse);
    res.send(huntItemsResponse);
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;

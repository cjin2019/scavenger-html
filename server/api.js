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

router.post("/game", (req, res) => {
  Hunt.findById(req.body.huntId).then((hunt) => {
    HuntItem.find({huntId: hunt._id}).then((huntItems) => {
      const ids = huntItems.map((huntItem) => (huntItem._id));
      const newGame = new Game({
        huntId: hunt._id,
        creatorId: req.body.creatorId,
        orderHuntItemIds: ids,
      });
      newGame.save().then(() => {res.send({});})
    });
  });
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

router.post("/player", (req, res) => {
  console.log(req.body);
  if(req.body.playerId){
    console.log("reached the first if statement");
    if(req.body.itemIndex !== undefined){
      console.log("reached inside");
      Player.findByIdAndUpdate(req.body.playerId, 
                                {$set: {
                                  currentHuntItemIndex: req.body.itemIndex,
                                }}).then(()=> {res.send({});});
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
  if(req.query.creatorId){
    Hunt.find({ creatorId: req.query.creatorId}).then((hunt) => {
      res.send(hunt);
    });
  } else {
    Hunt.findById(req.query.huntId).then((hunt) => {
      res.send(hunt);
    })
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
      answer: huntitem.answer
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

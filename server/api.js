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
  return pipeline;
}

/**
 * @param {JSON/null} response 
 * @returns {JSON}
 */
function sendValidResponse(response){
  return response === null ? {} : response;
}

/**
 * @param {string} playerId id of the player
 */
function incrementNumCorrect(playerId, res){
  Player.findByIdAndUpdate(playerId, 
    {$inc: {
      numCorrect: 1,
    }},
    { new: true,}).then((player)=> { res.send(player); console.log(player);});
}

/**
 * @param {} res is the response 
 * @param {string} huntId id of the hunt
 * @param {string} creatorId id of the creator
 * @param {huntitem[]} huntItems is a list of hunt items that are in the hunt
 */
function createGame(res, huntId, creatorId, huntItems){
  const ids = huntItems.map((huntItem) => (huntItem._id));
  const newGame = new Game({
    huntId: huntId,
    creatorId: creatorId,
    orderHuntItemIds: ids,
    startTime: null,
    setting: {
      timeLimitMilliseconds: 1000*60*1,
      numSubmissionLimit: 2,
    },
  });
  newGame.save().then((game) => {res.send({game});});
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

// for creating a new game
router.post("/createnewgame", async (req, res) => {
  const game = await Game.findOne({creatorId: req.body.creatorId});
  if(game !== null){
    await Game.findByIdAndDelete(game._id);
  } 
  const hunt = await Hunt.findById(req.body.huntId);
  const huntItems = await HuntItem.find({huntId: req.body.huntId});
  createGame(res, hunt._id, req.body.creatorId, huntItems);
});

router.post("/updatenewgame", async (req, res) => {
  const game = await Game.findOne({creatorId: req.body.creatorId});
  let setting = null;
  if(game !== null){
    const newGame = await Game.findByIdAndUpdate(game._id, 
                          {$set: { setting : req.body.setting }}, {new: true});
    if(newGame !== null) {setting = newGame.setting;}
  }
  res.send({setting: setting});
});

// getting the new created game
router.get("/newgame", async (req, res) => {
  const game = await Game.findOne({creatorId: req.query.creatorId});
  const hunt = await Hunt.findById(game.huntId);
  res.send({title: hunt.title, description: hunt.description, setting: game.setting});
});

// creating a new player
router.post("/createnewplayer", async (req, res) => {
  const user = await User.findById(req.body.userId);
  const game = await Game.findOne({creatorId: req.body.userId});
  const player = await Player.findOne({"userInfo._id": req.body.userId});
  if(player !== null) {
    await Player.findByIdAndDelete(player._id);
  }
  const newPlayer = new Player({
    gameId: game._id,
    userInfo: {_id: user._id, name: user.name},
    currentHuntItemIndex: -1, //hard code to -1 for now
    numCorrect: 0,
  });
  const newPlayerObject = await newPlayer.save();
  console.log("player:");
  console.log(player);
  console.log("new player:");
  console.log(newPlayerObject);
  res.send({player: newPlayerObject});
});

router.get("/playerinfo", async (req, res) => {
  const player = await Player.findOne({"userInfo._id": req.query.userId});
  // later get all the names of the players using sockets!
  console.log(player);
  res.send({name: player.userInfo.name});
});

router.post("/startgame", async (req, res) => {
  const player = await Player.findOneAndUpdate({"userInfo._id": req.body.userId}, {$set: { currentHuntItemIndex : 0}});
  const game = await Game.findById(player.gameId);
  if(game.startTime === null){
    await Game.findByIdAndUpdate(game._id, {$set: { startTime : Date.now() }}, {new: true});
  }
  res.send({});
  // emit a message to all players playing the game that the game started!
});

////////////////////////////////////////

router.get("/checkanswer", (req, res) => {
  console.log(req.query);
  HuntItem.findById(req.query.huntItemId).then((huntitem) => {
    let isCorrect = false; 
    if(huntitem.answer === req.query.currentSubmission){
      isCorrect = true;
    }
    console.log(isCorrect);
    res.send({isCorrect: isCorrect});
  });
});

// get user info
router.get("/user", (req, res) => {
  User.findById(req.query.userId).then((user) => {
    res.send({
      name: user.name,
      _id: user._id,
    });
  });
});

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
  const update = { $set: {currentSubmission: req.body.currentSubmission,
                          isCorrect: req.body.isCorrect},
                   $inc:  {numSubmissions: 1}};
  SubmissionItem.findOneAndUpdate(filter, update, {upsert: true, returnOriginal: false}).then((submissionItem) => {
    res.send(submissionItem);
  });
});

router.post("/game", (req, res) => {
  if(req.body.action && req.body.action === "delete"){
    Game.findByIdAndDelete(req.body.gameId).then(() => {res.send({});});
  } else if (req.body.action && req.body.action === "update") {
    if (req.body.setting) {
      Game.findByIdAndUpdate(req.body.gameId, {$set: { setting : req.body.setting }}, {new: true}).then((game) => {res.send(game); console.log(game);});
    }
    else {
      Game.findByIdAndUpdate(req.body.gameId, {$set: { startTime : Date.now() }}, {new: true}).then((game) => {res.send(game); console.log(game);});
    }
  } else{
    Hunt.findById(req.body.huntId).then((hunt) => {
      HuntItem.find({huntId: hunt._id}).then((huntItems) => {
        createGame(res, hunt._id, req.body.creatorId, huntItems);
      });
    });
  }
});

router.get("/game", (req, res) => {
  if(req.query.creatorId){
    Game.findOne({creatorId: req.query.creatorId}).then((game) => {
      res.send(sendValidResponse(game));
      console.log(game);
    });
  } else {
    Game.findById(req.query.gameId).then((game) => {
      res.send(sendValidResponse(game));
      console.log(game);
    });
  }
  
});

router.post("/deleteplayer", (req, res) => {
  if(req.body.userId){
    Player.findOneAndDelete({"userInfo._id": req.body.userId}).then((response) => {
      console.log(response);
      res.send({msg: "DELETED PLAYER"});
    });
  } else{
    Player.findByIdAndDelete(req.body.playerId).then(() => {
      res.send({msg: "DELETED PLAYER"});
    });
  }
});

router.post("/player", (req, res) => {
  if(req.body.playerId){
    if(req.body.itemIndex !== undefined){
      Player.findByIdAndUpdate(req.body.playerId, 
                                {$set: {
                                  currentHuntItemIndex: req.body.itemIndex,
                                }},
                                { new: true,}).then((player)=> { res.send(player);});
    } else if(req.body.millisecondsToSubmit){
      Player.findByIdAndUpdate(req.body.playerId, 
                                {$set: {
                                  millisecondsToSubmit: req.body.millisecondsToSubmit,
                                }},
                                { new: true,}).then((player)=> { res.send(player); console.log(player);});
    } 
    else{
      incrementNumCorrect(req.body.playerId, res);
    }
  } else {
    const newPlayer = new Player({
      gameId: req.body.gameId,
      userInfo: req.body.user,
      currentHuntItemIndex: -1, //hard code to -1 for now
      numCorrect: 0,
    });
    newPlayer.save().then((player) => {res.send({player});});
  }
});

router.get("/player", (req, res) => {
  const query = {"userInfo._id": req.query._id};
  Player.findOne(query).then((player) => {
    res.send(sendValidResponse(player));
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
    const query = (req.query.creatorId === "ALL_USERS") ? 
    { isFinalized:  req.query.isFinalized === "true",
    } : {
      creatorId: req.query.creatorId,
      isFinalized: req.query.isFinalized === "true",
    };
    Hunt.find(query).then((hunts) => {
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
  const ids = req.query.huntItemIds.split(",").map((idString) =>(mongo.ObjectID(idString)));
  const pipeline = getOrderedHuntItems(ids);
  HuntItem.aggregate(pipeline).then((huntitems) => {
    const huntItemsResponse = huntitems.map((huntitem) => ({
      _id: huntitem._id,
      question: huntitem.question,
    }));
    res.send(huntItemsResponse);
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;

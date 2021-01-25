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
const CollectedTag = require("./models/collectedtag");
const Avatar = require("./models/avatar");
const Award = require("./models/award");

const constants = require("./constants");

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

const { mongo } = require("mongoose");

const gameLogic = require("./logic");
// writing helper function

/**
 * @param {String} ids the list of ids to retrieve 
 * @returns {HuntItem[]} an ordered list of huntitems
 */
function getOrderedHuntItems(ids) {
  const pipeline = [
    {$match: {"_id": {$in: ids}}},
    {$addFields: {"__order": {$indexOfArray: [ids, "$_id" ]}}},
    {$sort: {"__order": 1}}
   ];
   gameLogic.gameState.huntItems = HuntItem.aggregate(pipeline).exec();
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

/**
 * @param {string} userId id of the user
 * @param {} res to help send back the response
 * return an object with fields player (following the player schema), submissionItem (following submissionItem schema)
 */
function getNewPlayerGameState(userId, res){
  Player.findOne({"userInfo._id": userId}).then((player) => {
    Game.findById(player.gameId).then((game) => {
      gameLogic.gameState.game = game;
      const ids = game.orderHuntItemIds.map(idString => mongo.ObjectID(idString));
      
      const pipeline = [
        {$match: {"_id": {$in: ids}}},
        {$addFields: {"__order": {$indexOfArray: [ids, "$_id" ]}}},
        {$sort: {"__order": 1}}
       ];
       HuntItem.aggregate(pipeline).then((huntItems) => {
         gameLogic.gameState.huntItems = huntItems;
         const query = {
            playerId: player._id,
            huntItemId: gameLogic.gameState.huntItems[player.currentHuntItemIndex]._id,
            gameId: gameLogic.gameState.game._id,
          };
         SubmissionItem.findOne(query).then((submissionItem) => {
          sendPlayerSubmission(player, submissionItem, res);

          sendCurrentScoreboard();
         });
       });
    });
  });
}

/**
 * 
 * @param {Player} player player object retrieved from model
 * @param {SubmissionItem} submission submission object retrieved from the mode
 * @param {} res to help send back the response
 */
function sendPlayerSubmission (player, submissionItem, res){
  const huntItems = gameLogic.gameState.huntItems;
  const game = gameLogic.gameState.game;
  const index = player.currentHuntItemIndex;
  console.log(game);
  let playitems = {
    player: { numCorrect: player.numCorrect },
    game: {
      startTime: game.startTime,
      setting: game.setting,
      numItems: huntItems.length
    },
    huntItem: {
      question: huntItems[index].question,
      index: index
    },
    currentSubmissionItem: {
      currentSubmission: "",
      isCorrect: false,
      numSubmissions: 0
    }
  }
  if(submissionItem !==null){
    playitems.currentSubmissionItem = {currentSubmission: submissionItem.currentSubmission,
                                      isCorrect: submissionItem.isCorrect,
                                      numSubmissions: submissionItem.numSubmissions}
  }
  res.send(playitems);
}
/**
 * 
 * @param {Object} filter with fields playerId, huntItemId, gameId
 * @param {string} currentSubmission the new submission
 * @param {boolean} isCorrect whether the submission is correct
 * 
 * @returns a current submission item object
 */
async function updateSubmission(filter, currentSubmission, isCorrect){
  const update = { $set: {currentSubmission: currentSubmission,
                          isCorrect: isCorrect},
                    $inc:  {numSubmissions: 1}};
  let submissionItem = await SubmissionItem.findOne(filter);
  if(submissionItem === null){
    submissionItem = await createSubmission(filter, currentSubmission, isCorrect);
  } else {
    submissionItem = await SubmissionItem.findOneAndUpdate(filter, update, {new: true});
  }
  console.log("In update submission: ");
  console.log(submissionItem);
  return { 
    currentSubmission: submissionItem.currentSubmission,
    isCorrect: submissionItem.isCorrect,
    numSubmissions: submissionItem.numSubmissions
  };
}

/**
 * 
 * @param {Object} ids with playerId, gameId, and huntItemId as object
 * @param {string} currentSubmission the submission content
 * @param {boolean} isCorrect whether the submission is correct
 */
async function createSubmission(ids, currentSubmission, isCorrect){
  const newSubmission = new SubmissionItem({
    playerId: ids.playerId,
    gameId: ids.gameId,
    huntItemId: ids.huntItemId,
    currentSubmission: currentSubmission,
    isCorrect: isCorrect,
    numSubmissions: 1,
  });

  return newSubmission.save();
}

/**
 * @param {string} userId the id of the user
 * @param {string} huntItemId the id of the hunt item
 * @param {*} res to send back the response to the client
 */
async function createNewCollectedTag(userId, huntItemId, res){
  const numTags = constants.allTags.length;
  const tag = constants.allTags[Math.floor(Math.random()*numTags)];
  const newCollectedTag = new CollectedTag({
    userId: userId,
    huntItemId: huntItemId,
    tag: tag,
  });
  await newCollectedTag.save();
  res.send({tag: tag, alreadyCollected: false});
}

/**
 * @param {string} userId the id of the user
 * @param {Game} game a game object following the game schema
 * @param {*} res the object that allows server to send response back to the client
 */
async function createNewPlayer(userId, game, res){
  const user = await User.findById(userId);
  if(game === null){
    res.send({msg: "NO GAME"});
  } else {
    const player = await Player.findOne({"userInfo._id": userId});
    if(player !== null) {
      await Player.findByIdAndDelete(player._id);
    }
    const newPlayer = new Player({
      gameId: game._id,
      userInfo: {_id: user._id, name: user.name},
      currentHuntItemIndex: -1, //hard code to -1 for now
      millisecondsLastCorrect: game.setting.timeLimitMilliseconds + 10000,
      numCorrect: 0,
    });
    const newPlayerObject = await newPlayer.save();
    console.log(newPlayerObject);
    res.send({});
  }
}

/**
 * Sends to the socket currentscoreboard the list of players with the field name and numCorrect: 
 */
async function sendCurrentScoreboard(){
  console.log(gameLogic.gameState);
  const allPlayers = await Player.find({gameId: gameLogic.gameState.game._id});
  const allPlayersDisplay = allPlayers.map(player => 
                                          ({name: player.userInfo.name, numCorrect: player.numCorrect,
                                            millisecondsLastCorrect: player.millisecondsLastCorrect}))
                                      .sort(compareCurrentScoreboard);
  const playersFirst3 = allPlayersDisplay.slice(0, Math.min(3, allPlayersDisplay.length));
  const userIds = allPlayers.map(player => player.userInfo._id);
  userIds.forEach(userId => {
    socketManager.getSocketFromUserID(userId).emit("currentscoreboard", playersFirst3);
  });
}

/**
 * @param {Player} player1 
 * @param {Player} player2 
 * return -1 if player1 precedes player2
 * return 0 if player1 = player2
 * return 1 if player1 succedes player2
 */
function compareCurrentScoreboard(player1, player2){
  if(player1.numCorrect > player2.numCorrect) { return -1;}
  else if(player1.numCorrect < player2.numCorrect) {return 1;}
  else {
    if(player1.millisecondsLastCorrect < player2.millisecondsLastCorrect) {return -1;}
    else if(player1.millisecondsLastCorrect > player2.millisecondsLastCorrect) {return 1;}
    else {return 0;}
  }
}

/**
 * @param {Object} players with the field _id and numCorrect
 * @param {string} huntId id of the hunt
 */
async function updatePointsForTopThree(players, huntId){
  const numPlayers = Math.min(players.length, 3);

  for (let i = 0; i < Math.min(players.length, 3); i++) {
    let award = await Award.findOne({userId: players[i]._id, huntId: huntId});
    let hasEarnedPointsForHunt = true;
    if(award === null && players[i].numCorrect > 0){
      hasEarnedPointsForHunt = false; 
      award = await (new Award({
        userId: players[i]._id,
        huntId: huntId,
        points: 2*numPlayers+1 - 2*(i+1) // hardcoded to 5, 3, 1
      })).save();
    } 
    if(players[i].numCorrect > 0){
      socketManager.getSocketFromUserID(players[i]._id).emit("top3award", {points: award.points, earnedAlready: hasEarnedPointsForHunt});
    }
  }
}

/**
 * @param {Object} players with field _id, name, millisecondsToSubmit, numCorrect
 * @returns a list of players without the _id
 */
function removePlayerUserIds(players){
  return players.map((player) => ({
    name: player.name, 
    numCorrect: player.numCorrect, 
    millisecondsToSubmit: player.millisecondsToSubmit}));
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
  if(game !== null){
    const newGame = await Game.findByIdAndUpdate(game._id, 
                          {$set: { setting : req.body.setting }}, {new: true});
    await createNewPlayer(req.body.creatorId, newGame, res);
  } else{
    res.send({});
  }
});

// getting the new created game
router.get("/newgame", async (req, res) => {
  const game = await Game.findOne({creatorId: req.query.creatorId});
  const hunt = await Hunt.findById(game.huntId);
  res.send({title: hunt.title, description: hunt.description, setting: game.setting});
});

// join game page
router.post("/joinnewplayer", async (req, res) => {
  try {
    const game = await Game.findById(req.body.gameId);
    await createNewPlayer(req.body.userId, game, res);
    const players = await Player.find({gameId: game._id});
    const playerNames = players.map(player => player.userInfo.name);
    const userIds = players.map(player => player.userInfo._id);

    userIds.forEach((userId) => {
      socketManager.getSocketFromUserID(userId).emit("joinplayers", playerNames);
    }); 
  } catch (error) {
    res.send({msg: "INVALID CODE"});
  }
});

// start game page
router.get("/gameinfo", async (req, res) => {
  const player = await Player.findOne({"userInfo._id": req.query.userId});
  const allPlayers = await Player.find({gameId: player.gameId});
  const playerNames = allPlayers.map(player => player.userInfo.name);
  res.send({gameId: player.gameId, names: playerNames});
});

// should have stored player and game in the server?
router.get("/playerinfo", async (req, res) => {
  const player = await Player.findOne({"userInfo._id": req.query.userId});
  const game = await Game.findById(player.gameId);
  const allPlayers = await Player.find({gameId: game._id});
  let isDone = true;
  allPlayers.forEach((player) => {if(player.millisecondsToSubmit === undefined){isDone = false;}});
  if(isDone){
    const userIds = allPlayers.map(player => player.userInfo._id);
    const allPlayersSort = allPlayers.map((player) => ({ _id: player.userInfo._id,
                                                      name: player.userInfo.name, 
                                                      numCorrect: player.numCorrect, 
                                                      millisecondsToSubmit: player.millisecondsToSubmit}))
                                    .sort((player1, player2) => {
                                      if(player1.numCorrect > player2.numCorrect) {return -1;}
                                      else if (player1.numCorrect < player2.numCorrect) {return 1;}
                                      else {return (player1.millisecondsToSubmit < player2.millisecondsToSubmit) ? -1: 1;}
                                    });
    const allPlayersInfo = removePlayerUserIds(allPlayersSort);
    // later get all the names of the players using sockets!
    res.send({players: allPlayersInfo});
    userIds.forEach((userId) => {
      socketManager.getSocketFromUserID(userId).emit("scoreboard", allPlayersInfo);
    });
    await updatePointsForTopThree(allPlayersSort, gameLogic.gameState.game.huntId);
  } else{
    res.send({msg: "NOT DONE"});
  }
});

router.post("/playerinfo", (req, res) => {
  Player.findOneAndUpdate({"userInfo._id": req.body.userId},
                          {$set: { millisecondsToSubmit: req.body.millisecondsToSubmit}},
                          {new: true}).then((player) =>{
      res.send({});
  });

});

router.post("/startgame", async (req, res) => {
  const player = await Player.findOne({"userInfo._id": req.body.userId});
  const game = await Game.findById(player.gameId);
  if(game.startTime === null){
    await Game.findByIdAndUpdate(game._id, {$set: { startTime : Date.now() }}, {new: true});
    await Player.updateMany({gameId: game._id}, {$set: { currentHuntItemIndex : 0}});
    const allPlayers = await Player.find({gameId: game._id});
    const userIds = allPlayers.map(player => player.userInfo._id);

    userIds.forEach((userId) => {
        socketManager.getSocketFromUserID(userId).emit("gamestart", {});
    });
  } 
});

// now for play game don't use socket yet
router.get("/initplaygame", (req, res) => {
  getNewPlayerGameState(req.query.userId, res);
});

router.post("/nextquestion", async (req, res) => {
  // for now don't store player in logic
  const player = await Player.findOneAndUpdate({"userInfo._id": req.body.userId}, 
                        {$inc: {currentHuntItemIndex: req.body.inc,}},
                        { new: true,});
  const game = gameLogic.gameState.game;
  const huntItem = gameLogic.gameState.huntItems[player.currentHuntItemIndex];
  const submissionItem = await SubmissionItem.findOne({playerId: player._id, gameId: game._id, 
                                                      huntItemId: huntItem._id});
  let playitems = {
    huntItem: { question:  huntItem.question, index: player.currentHuntItemIndex},
    currentSubmissionItem: {
      currentSubmission: "",
      isCorrect: false,
      numSubmissions: 0
    }
  };

  if(submissionItem !== null ){
    playitems.currentSubmissionItem = {currentSubmission: submissionItem.currentSubmission,
                                        isCorrect: submissionItem.isCorrect,
                                        numSubmissions: submissionItem.numSubmissions};
  }
  res.send(playitems);
});

router.post("/updatesubmission", async (req, res) => {
  let player = await Player.findOne({"userInfo._id": req.body.userId});
  const filter = {
    playerId: player._id,
    huntItemId: gameLogic.gameState.huntItems[player.currentHuntItemIndex]._id,
    gameId: gameLogic.gameState.game._id,
  };
  let isCorrect = false; 
  if(gameLogic.gameState.huntItems[player.currentHuntItemIndex].answer === req.body.currentSubmission){
    isCorrect = true;
    player = await Player.findByIdAndUpdate(player._id, {$inc: {numCorrect: 1}, $set: {millisecondsLastCorrect: req.body.millisecondsLastCorrect}}, 
                                            {new: true});
  }
  const submission = await updateSubmission(filter, req.body.currentSubmission, isCorrect);
  const playerSend = {numCorrect: player.numCorrect};
  const submissionSend = {currentSubmission: submission.currentSubmission, 
                          isCorrect: submission.isCorrect,
                          numSubmissions: submission.numSubmissions,};
  res.send({player: playerSend, submissionItem: submissionSend});
  await sendCurrentScoreboard();
});

// get the new tag or post if does not exist
router.get("/playtag", async (req, res) => {
  const player = await Player.findOne({"userInfo._id": req.query.userId});
  const huntItemId = gameLogic.gameState.huntItems[player.currentHuntItemIndex]._id;
  let collectedTag = await CollectedTag.findOne({userId: req.query.userId, huntItemId: huntItemId});
  if(collectedTag === null){
    createNewCollectedTag(req.query.userId, huntItemId, res);
  } else {
    res.send({tag: collectedTag.tag, alreadyCollected: true});
  }
});

// get profile infor
router.get("/profileinfo", async (req, res) => {
  const user = await User.findById(req.query.userId);
  let avatar = await Avatar.findOne({userId: user._id});
  if(avatar === null){
    avatar = await (new Avatar({
      userId: user._id,
      color: "#04e004",
    })).save();
  }
  const collectedTags = await CollectedTag.find({userId: req.query.userId});
  const tagNames = collectedTags.map(tag => tag.tag);
  const freqTags = {};
  tagNames.forEach(tagName => {
    if(freqTags[tagName]) {freqTags[tagName]++}
    else  {freqTags[tagName] = 1}
  });
  res.send({
    name: user.name,
    tags: freqTags,
    color: avatar.color,
  });
});

// create scavenger api requests
router.get("/hunttemplate", async (req, res) => {
  const hunt = await Hunt.findOne({
    creatorId: req.query.creatorId,
    isFinalized: false,
  });
  res.send({huntExists: hunt !==null});
});

router.post("/createhunttemplate", async (req, res) => {
  const hunt = await Hunt.findOne({
    creatorId: req.body.creatorId,
    isFinalized: false,
  });
  const hasSubmitted = hunt !== null;
  let newHunt = null;
  let huntItems = [];
  if(!req.body.reuse){
    if(hasSubmitted){
      await Hunt.findByIdAndDelete(hunt._id);
    }
    newHunt  = await (new Hunt({ creatorId: req.body.creatorId, isFinalized: false, title: "", description: ""})).save();
  } else {
    newHunt = hunt;
    huntItems = await HuntItem.find({huntId: hunt._id});
  }
  huntItemsDisplay = huntItems.map((huntItem) => ({question: huntItem.question, answer: huntItem.answer}));
  newHuntDisplay = {title: newHunt.title, description: newHunt.description};
  res.send({hunt: newHuntDisplay, huntItems: huntItemsDisplay}); 
});

router.post("/createhunt", async (req, res) => {
  const hunt = await Hunt.findOneAndUpdate({creatorId: req.body.creatorId, isFinalized: false}, 
                                           {$set: {title: req.body.title,
                                                  description: req.body.description,
                                                  isFinalized: true}});
  res.send({});
});

router.post("/deletehunt", async (req, res) => {
  await Hunt.findOneAndDelete({creatorId: req.body.creatorId, isFinalized: false});
  res.send({});
});

router.post("/newhuntitem", async (req, res) => {
  const hunt = await Hunt.findOne({creatorId: req.body.creatorId, isFinalized: false});
  const newHuntItem = await (new HuntItem({
    huntId: hunt._id,
    question: req.body.question,
    answer: req.body.answer,
  })).save();
  res.send({question: newHuntItem.question, answer: newHuntItem.answer});
});

router.post("/avatarcolor", async (req, res) => {
  await Avatar.findOneAndUpdate({userId: req.body.userId}, {$set: {color: req.body.color}});
  res.send({});
});
////////////////////////////////////////

// get user info
router.get("/user", (req, res) => {
  User.findById(req.query.userId).then((user) => {
    res.send({
      name: user.name,
      _id: user._id,
    });
  });
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

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;

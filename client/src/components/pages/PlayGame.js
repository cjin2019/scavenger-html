import React, { Component } from "react";
import PlayHuntItem from "../modules/PlayHuntItem.js";
import PlayNavBar from "../modules/PlayNavBar.js";
import { get, post } from "../../utilities";

import "../../utilities.css";

/**
 * This is the game page that displays starting the game and
 * playing the game
 * 
 * @param {string} userId id of the user
 * @param {(callback function) => void} getUser is a function to execute when new game is remounted
 */
class PlayGame extends Component {
    constructor(props){
        super(props);

        this.state = {
            player: {
                gameId: "",
                userInfo: null,
                currentHuntItemIndex: 0,
                numCorrect: 0,
            },
            game: {
                huntId: "",
                orderHuntItemIds: [],
            },
            huntItems: [],
            currentSubmission: "",
            isCorrect: false,
        }
    }

    hardCodeUser = () => {
        return {
            _id: "creatorId_1",
            name: "Hardcode name",
        };
    }

    // helper set up

    getPreviousSubmission = () => {
        const index = this.state.player.currentHuntItemIndex;
        const query = {
            playerId: this.state.player._id,
            gameId: this.state.game._id,
            huntItemId: this.state.huntItems[index]._id,
        }
        get("api/submission", query).then((submissionItem) =>{
            //if submission exists
            if(submissionItem.currentSubmission){
                this.setState({
                    currentSubmission: submissionItem.currentSubmission,
                    isCorrect: submissionItem.isCorrect,
                })
            } else {
                this.setState({
                    currentSubmission: "",
                    isCorrect: false,
                })
            }
            
        });
    };

    getHuntItems = (huntItemIds) => {
        get("api/playhuntitems", {huntItemIds: huntItemIds}).then((huntItems) => {

            this.setState({
                huntItems: huntItems,
            });

            this.getPreviousSubmission();
        });
    };

    getGame = (gameId) => {
        get("api/game", {gameId: gameId}).then((game) => {

            this.setState({
                game: game,
            });

            this.getHuntItems(game.orderHuntItemIds);
        });
    };

    getPlayer = (user) => {
        get("api/player", user).then((player) => {
            this.setState({
                player: player,
            });

            this.getGame(player.gameId);
        });
    }

    onChange = (event) => {
        this.setState({
            currentSubmission: event.target.value,
        });
    }

    //return true if correct
    onSubmit = () => {
        const index = this.state.player.currentHuntItemIndex;
        const body = {
            playerId: this.state.player._id,
            gameId: this.state.game._id,
            huntItemId: this.state.huntItems[index]._id,
            currentSubmission: this.state.currentSubmission,
            isCorrect: this.checkAnswer(),
        }

        console.log(body.isCorrect);
        post("api/submission", body).then((submissionItem) => {
            console.log(submissionItem);
            this.setState({
                isCorrect: body.isCorrect,
            });

        });
    };

    getUserInfo = () => {
        get("api/user", {userId: this.props.userId}).then((user) => {
            console.log("Set user info in play game: " + user);
            this.getPlayer(user);
        });
    };


    componentDidMount(){
        this.props.getUser(this.getUserInfo);
    }

    // assuming decrementing on all items but first
    // and incrementing on all items but last
    // inc is {+1, -1}
    moveToDifferentQuestion = (inc) => {

        const body = {
            playerId: this.state.player._id,
            itemIndex: this.state.player.currentHuntItemIndex + inc,
        }
        post("api/player", body).then((player) => {
            this.setState({
                player: player,
            });

            console.log("updated submission too!");
            this.getPreviousSubmission();
        });
    };

    // returns a boolean if answer is correct
    // for now in get request return huntitem answer
    // later for security return 
    checkAnswer = () => {
        const correctAnswer = this.state.huntItems[this.state.player.currentHuntItemIndex].answer;
        console.log(this.state.huntItems[this.state.player.currentHuntItemIndex]);
        return this.state.currentSubmission === correctAnswer;
    }

    render(){

        const playerIndex = this.state.player.currentHuntItemIndex;
        const numItems = this.state.huntItems.length;
        let displayItem = (this.state.huntItems.length === 0 || 
                            this.state.huntItems[playerIndex] === undefined) ? (<div></div>) :
                                                                 (<PlayHuntItem 
                                                                    huntItem = {this.state.huntItems[playerIndex]}
                                                                    onChange = {this.onChange}
                                                                    onSubmit = {this.onSubmit}
                                                                    currentSubmission = {this.state.currentSubmission}
                                                                    isCorrect = {this.state.isCorrect}
                                                                 />); 
        return (
            <div>
                <PlayNavBar onSubmit = {this.moveToDifferentQuestion}
                            itemIndex = {playerIndex}
                            numItems = {numItems}
                            player = {this.state.player}
                />
                {displayItem}
            </div>

        );
    }
}

export default PlayGame;
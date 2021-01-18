import React, { Component } from "react";
import PlayHuntItem from "../modules/PlayHuntItem.js";
import PlayNavBar from "../modules/PlayNavBar.js";
import { get, post } from "../../utilities";

import "../../utilities.css";

/**
 * This is the game page that displays starting the game and
 * playing the game
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
            currentSubmission: ""
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
                })
            } else {
                this.setState({
                    currentSubmission: "",
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

    onChange = (event) => {
        this.setState({
            currentSubmission: event.target.value,
        });
    }

    onSubmit = () => {
        const index = this.state.player.currentHuntItemIndex;
        const body = {
            playerId: this.state.player._id,
            gameId: this.state.game._id,
            huntItemId: this.state.huntItems[index]._id,
            currentSubmission: this.state.currentSubmission,
        }
        post("api/submission", body).then((submissionItem) => {
            this.setState({
                currentSubmission: submissionItem.currentSubmission,
            });
            console.log(this.state.checkAnswer());
        });
    }

    componentDidMount(){

        const body = this.hardCodeUser();

        get("api/player", body).then((player) => {
            this.setState({
                player: player,
            });

            this.getGame(player.gameId);

        });
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
        const correctAnswer = this.state.huntItems[this.state.player.currentHuntItemIndex];
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
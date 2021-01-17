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
        }
    }

    hardCodeUser = () => {
        return {
            _id: "creatorId_1",
            name: "Hardcode name",
        };
    }

    // helper set up

    getHuntItems = (huntItemIds) => {
        get("api/playhuntitems", {huntItemIds: huntItemIds}).then((huntItems) => {
            console.log("Got items");
            console.log(huntItems);

            this.setState({
                huntItems: huntItems,
            });
        });
    };

    getGame = (gameId) => {
        get("api/game", {gameId: gameId}).then((game) => {
            console.log("Got game");
            console.log(game);
            this.setState({
                game: game,
            });

            this.getHuntItems(game.orderHuntItemIds);
        });
    };

    componentDidMount(){

        const body = this.hardCodeUser();

        get("api/player", body).then((player) => {
            console.log("Got player");
            console.log(player);
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
        this.setState({
            currentHuntItemIndex: this.state.player.currentHuntItemIndex + inc,
        });
    };

    // returns a boolean if answer is correct
    checkAnswer = (answer, expectedAnswer) => {
        return answer === expectedAnswer;
    }

    render(){
        const data = {
            hunt: {
                title: "This is a hardcoded title",
                description: "This is a hardcoded description"
            },
            huntItems: [{
                question: "This is a hardcoded question 1",
                answer: "This is a hardcoded answer 1"
            }, {
                question: "2",
                answer: "2"
            }, {
                question: "3",
                answer: "3"
            }
            ]
        };

        const index = this.state.player.currentHuntItemIndex;
        const numItems = this.state.huntItems.length;
        let displayItem = (this.state.huntItems.length === 0 ) ? (<div></div>) :
                                                                 (<PlayHuntItem 
                                                                    huntItem = {this.state.huntItems[index]}
                                                                    checkAnswer = {this.checkAnswer}
                                                                 />); 
        return (
            <div>
                <PlayNavBar onSubmit = {this.moveToDifferentQuestion}
                            itemIndex = {index}
                            numItems = {numItems}
                />
                {displayItem}
            </div>

        );
    }
}

export default PlayGame;
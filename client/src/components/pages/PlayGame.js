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

            this.setState({
                huntItems: huntItems,
            });
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

    componentDidMount(){

        const body = this.hardCodeUser();

        get("api/player", body).then((player) => {
            this.setState({
                player: player,
                currentHuntItemIndex: player.currentHuntItemIndex,
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
        });
    };

    // returns a boolean if answer is correct
    checkAnswer = (answer, expectedAnswer) => {
        return answer === expectedAnswer;
    }

    render(){

        const playerIndex = this.state.player.currentHuntItemIndex;
        const numItems = this.state.huntItems.length;
        let displayItem = (this.state.huntItems.length === 0 || 
                            this.state.huntItems[playerIndex] === undefined) ? (<div></div>) :
                                                                 (<PlayHuntItem 
                                                                    huntItem = {this.state.huntItems[playerIndex]}
                                                                    checkAnswer = {this.checkAnswer}
                                                                 />); 
        return (
            <div>
                <PlayNavBar onSubmit = {this.moveToDifferentQuestion}
                            itemIndex = {playerIndex}
                            numItems = {numItems}
                />
                {displayItem}
            </div>

        );
    }
}

export default PlayGame;
import React, { Component } from "react";
import { navigate } from "@reach/router";
import { get, post } from "../../utilities";

import "../../utilities.css";


/**
 * This is the NewGame component which gives the player the option to start
 * game or go home
 *
 * Proptypes
 * @param {string} userId id of the user
 */
class NewGame extends Component {
    constructor(props){
        super(props);

        this.state = {
            title: "",
            description: "",
            gameId: "",
        }
    }

    hardCodeUser = () => {
        return {
            _id: "creatorId_1",
            name: "Hardcode name",
        };
    }

    getHunt = (huntId) => {
        get("api/hunt", {huntId: huntId}).then((hunt) => {
            this.setState({
                title: hunt.title,
                description: hunt.description
            });
        });
    }

    getGame = (creatorId) => {
        get("api/game", {creatorId: creatorId}).then((game) =>{
            this.setState({
                gameId: game._id,
            });

            this.getHunt(game.huntId);
        });
    }
    componentDidMount(){
        const user = {
            _id: "creatorId_1",
            name: "Hardcode name",
        }

        this.getGame(user._id);
    }

    handleGoHome = () => {
        //send a post request to delete a game
        const body = {
            gameId: this.state.gameId,
            action: "delete",
        }
        post("api/game", body).then(() => {
            navigate("/userhome");
        });
    }

    handleStart = () => {
        //send a post request to create a player
        const user = this.hardCodeUser();
        const body = {
            user: user, 
            gameId: this.state.gameId,
            action: "add",
        }
        post("api/player", body).then(() => {
            navigate("/startgame");
        });
    }

    render(){

        return (
            <div>
                <h2>{this.state.title}</h2>
                <h4>{this.state.description}</h4>
                <div>
                    <button
                        onClick = {this.handleGoHome}
                    >
                        {"<go home/>"}
                    </button>
                    <button
                        onClick = {this.handleStart}
                    >
                        {"<start/>"}
                    </button>
                </div>
            </div>
        );
    }
}

export default NewGame;
import React, { Component } from "react";
import { navigate } from "@reach/router";
import { get, post } from "../../utilities";

import "../../utilities.css";


/**
 * This is the NewGame component which gives the player the option to start
 * game or go home
 *
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

    componentDidMount(){
        const user = {
            _id: "creatorId_1",
            name: "Hardcode name",
        }

        get("api/game", {creatorId: user._id}).then((game) =>{
            this.setState({
                gameId: game._id,
            });
            get("api/hunt", {huntId: game.huntId}).then((hunt) => {
                this.setState({
                    title: hunt.title,
                    description: hunt.description
                });
            });
        });
    }

    handleGoHome = () => {
        //send a post request to delete a game
        navigate("/userhome");
    }

    handleStart = () => {
        //send a post request to create a player
        const user = {
            _id: "creatorId_1",
            name: "Hardcode name",
        }
        
        post("api/player", {user: user, gameId: this.state.gameId}).then(() => {
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
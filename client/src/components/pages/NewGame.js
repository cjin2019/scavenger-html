import React, { Component } from "react";
import { navigate } from "@reach/router";
import { get, post } from "../../utilities";
import { forceUserLogin } from "./PageFunctions.js";

import "../../utilities.css";
import "./NewGame.css"
import "./ButtonPage.css"

/**
 * This is the NewGame component which gives the player the option to start
 * game or go home
 *
 * Proptypes
 * @param {string} userId id of the user
 * @param {(callback function) => void} getUser is a function to execute when new game is remounted
 */
class NewGame extends Component {
    constructor(props){
        super(props);

        this.state = {
            title: "",
            description: "",
            gameId: "",
            user: undefined,
        }
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

    getUserInfo = () => {
        if(this.props.userId){
            get("api/user", {userId: this.props.userId}).then((user) => {
                this.setState({
                    user: user,
                });
                this.getGame(this.props.userId);
            });
        }
    };

    componentDidMount(){
        this.props.getUser(() => {this.getUserInfo();});
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

    postNewPlayer = (body) => {
        post("api/player", body).then(() => {
            navigate("/startgame");
        });
    };

    handleStart = () => {
        //send a post request to create a player
        const body = {
            user: this.state.user, 
            gameId: this.state.gameId,
            action: "add",
        }

        if(confirm("Once you start game, you cannot leave the scavenger html until you complete!")){
            get("api/player", {_id: body.user._id}).then((player) => {
                if(player._id){
                    post("api/deleteplayer", {playerId: player._id}).then(() => {
                        this.postNewPlayer(body);
                    });
                } else{
                    this.postNewPlayer(body);
                }
            });
        }
    }

    render(){

        let display = (
            <div className = "NewGame-container">
                <h2>{this.state.title}</h2>
                <h4>{this.state.description}</h4>
                <div className = "ButtonPage-buttonContainer">
                    <button
                        onClick = {this.handleGoHome}
                        className = "ButtonPage-button"
                    >
                        {"<go home/>"}
                    </button>
                    <button
                        onClick = {this.handleStart}
                        className = "ButtonPage-button"
                    >
                        {"<start/>"}
                    </button>
                </div>
            </div>
        );

        return forceUserLogin(this.props.userId, display);
    }
}

export default NewGame;
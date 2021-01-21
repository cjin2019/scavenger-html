import React, { Component } from "react";
import { navigate } from "@reach/router";
import { get, post } from "../../utilities";
import { forceUserLogin } from "./PageFunctions.js";

import SettingInput from "../modules/SettingInput.js";

import "../../utilities.css";
import "./NewGame.css"
import "./ButtonPage.css"

const MINUTE_TO_MILLISECONDS = 60000;
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
            game: {
                setting: { timeLimitMilliseconds: 0,
                    numSubmissionLimit: 0}
            },
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
            game.setting.timeLimitMilliseconds /= MINUTE_TO_MILLISECONDS;
            this.setState({
                gameId: game._id,
                game: game,
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
        this.props.getUser(this.getUserInfo);
    }

    handleGoHome = () => {
        //send a post request to delete a game
        const body = {
            gameId: this.state.game._id,
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
            gameId: this.state.game._id,
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

    /**
     * @param {string} key the setting to update
     * @param {string} value to update with
     */
    updateSettingState = (key, value) => {
        let currentGame = {...this.state.game}
        currentGame.setting[key] = value;
        this.setState({
            game: currentGame
        });
    }
    /**
     * 
     * @param {} event an event object
     * @param {string} key the setting to update
     */
    onChange = (event, key) => {
        this.updateSettingState(key, event.target.value);
    }

    /**
     * @param {string} key the setting to update
     * @returns true if saved and false otherwise
     */
    settingUpdate = (key) => {
        const numberValue = this.filterInt(this.state.game.setting[key]);
        if(numberValue !== null){
            const body = {
                gameId: this.state.game._id,
                action: "update",
                setting: {
                    timeLimitMilliseconds: this.state.game.setting.timeLimitMilliseconds * MINUTE_TO_MILLISECONDS,
                    numSubmissionLimit: this.state.game.setting.numSubmissionLimit
                },
            }
            post("api/game", body);
        } else{
            alert("Not a valid setting input!");
        }
    }

    /**
     * @param {string} value of the input
     * @returns a number if value is value and null otherwise
     */
    filterInt = (value) => {
        if (/^[-+]?(\d+|Infinity)$/.test(value)) {
          return Number(value);
        } else {
          return null;
        }
    }

    renderSettings = () => {
        const headingTitle = {
            timeLimitMilliseconds: "Total Time (minutes)",
            numSubmissionLimit: "Max number of submissions per hunt item"
        }

        return Object.entries(this.state.game.setting).map(([key, value]) => (
            <div
                key = {key}
            >
                <div>{headingTitle[key]}</div>
                <SettingInput 
                    settingKey = {key}
                    settingValue = {value}
                    onChange = {this.onChange}
                    settingUpdate = {this.settingUpdate}
                />
            </div>
        ));
    }
    render(){

        let display = (
            <div className = "NewGame-container">
                <h2>{this.state.title}</h2>
                <h4>{this.state.description}</h4>
                <div className = "NewGame-settingContainer">
                    <h3>Settings</h3>
                    <div>
                        {this.renderSettings()}
                    </div>
                </div>
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
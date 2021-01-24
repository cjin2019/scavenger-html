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
            setting: {
                timeLimitMilliseconds: 0,
                numSubmissionLimit: 0
            },
        }
    }

    getGameInfo = () => {
        if(this.props.userId){
            get("api/newgame", {creatorId: this.props.userId}).then((res) => {
                this.setState({
                    title: res.title,
                    description: res.description,
                    setting: {
                        timeLimitMilliseconds: res.setting.timeLimitMilliseconds / MINUTE_TO_MILLISECONDS,
                        numSubmissionLimit: res.setting.numSubmissionLimit,
                    },
                });
            });
        }
    }

    componentDidMount(){
        this.props.getUser(this.getGameInfo);
    }

    handleGoHome = () => {
        navigate("/userhome");
    }

    handleStart = () => {
        //send a post request to create a player
        if(confirm("Once you start game, you cannot leave the scavenger html until you complete!")){
            this.startGame();
        }
    }

    /**
     * @param {string} key the setting to update
     * @param {string} value to update with
     */
    updateSettingState = (key, value) => {
        let currentSetting = {...this.state.setting}
        currentSetting[key] = value;
        this.setState({
            setting: currentSetting
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

    startGame = () => {
        let validInput = true;
        Object.values(this.state.setting).forEach((value) => {
            if(this.filterInt(value) === null) {validInput = false;}
        });
        if(validInput){
            const body = {
                creatorId: this.props.userId,
                setting: {
                    timeLimitMilliseconds: this.state.setting.timeLimitMilliseconds * MINUTE_TO_MILLISECONDS,
                    numSubmissionLimit: this.state.setting.numSubmissionLimit
                },
            }
            post("api/updatenewgame", body).then(()=> {navigate("/startgame")});
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

        return Object.entries(this.state.setting).map(([key, value]) => (
            <div
                key = {key}
            >
                <div>{headingTitle[key]}</div>
                <SettingInput 
                    settingKey = {key}
                    settingValue = {value}
                    onChange = {this.onChange}
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
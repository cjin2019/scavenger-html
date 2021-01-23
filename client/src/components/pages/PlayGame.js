import React, { Component } from "react";
import PlayHuntItem from "../modules/PlayHuntItem.js";
import PlayNavBar from "../modules/PlayNavBar.js";
import { get, post } from "../../utilities";
import { navigate } from "@reach/router";
import { forceUserLogin } from "./PageFunctions.js";

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
            game: {
                startTime: Date.now(),
                setting: {
                    timeLimitMilliseconds: 1000*60*1,
                    numSubmissionLimit: 2,  
                }
            },
            player: {
                numCorrect: 0,
            },
            huntItem: {
                question: "",
                index: 0,
            },
            currentSubmissionItem: {
                currentSubmission: "",
                isCorrect: false,
                numSubmissions: 0,
            },
        }
    }

    // helper set up
    onChange = (event) => {
        let currentSubmissionItem = { ...this.state.currentSubmissionItem};
        currentSubmissionItem.currentSubmission = event.target.value;
        this.setState({
            currentSubmissionItem: currentSubmissionItem,
        });
    }

    onSubmit = () => {
        post("api/updatesubmission", {userId: this.props.userId, currentSubmission: this.state.currentSubmissionItem.currentSubmission}).then((playitems) => {
            this.setState({
                currentSubmissionItem: playitems.submissionItem
            })
        });
        
    };

    getInitialGameState = () => {
        if(this.props.userId){
            get("api/initplaygame", {userId: this.props.userId}).then((playitems) => {
                this.setState({
                    game: playitems.game,
                    huntItem: playitems.huntItem,
                    currentSubmissionItem: playitems.currentSubmissionItem,
                });
            });
        }
    }

    componentDidMount(){
        // this.props.getUser(this.getUserInfo);
        this.props.getUser(this.getInitialGameState);
    }

    // assuming decrementing on all items but first
    // and incrementing on all items but last
    // inc is {+1, -1}
    moveToDifferentQuestion = (inc) => {
        post("api/nextquestion", {userId: this.props.userId, inc: inc}).then((playitems) => {
            this.setState({
                huntItem: playitems.huntItem,
                currentSubmissionItem: playitems.currentSubmissionItem,
            });
        });
    };

    render(){
        let displayItem = (<PlayHuntItem 
                                huntItem = {this.state.huntItem}
                                onChange = {this.onChange}
                                onSubmit = {this.onSubmit}
                                currentSubmissionItem = {this.state.currentSubmissionItem}
                                game = {this.state.game}
                                userId = {this.props.userId}
                            />); 
        let display = (
            <div>
                <PlayNavBar onSubmit = {this.moveToDifferentQuestion}
                            numItems = {this.state.game.numItems}
                            userId = {this.props.userId}
                            index = {this.state.huntItem.index}
                            player = {this.state.player}
                            game = {this.state.game}

                />
                {displayItem}
            </div>

        );

        return forceUserLogin(this.props.userId, display);
    }
}

export default PlayGame;
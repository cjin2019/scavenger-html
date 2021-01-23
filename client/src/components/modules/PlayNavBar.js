import React, { Component } from "react";
import { navigate } from "@reach/router";
import Countdown, { zeroPad } from "react-countdown";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./NavBar.css";

/**
 * PlayNavBar is a component that is added to playhunt component
 * allows the user to go back and forth between hunt items
 * 
 * Proptypes
 * @param {Object} player is a player object containing only the numCorrect field
 * @param {(increment {+1, -1}) => void} onSubmit is a function to increment or decrement to
 * move on to the next question
 * @param {string} userId is the id of the user
 * @param {number} numItems is the number of hunt items in the hunt
 * @param {number} index is the index of the hunt item
 * @param {number} startTime is the current date and time 
 * @param {Object} game is a game object containing only the setting, startTime, and numItems fields
 */
class PlayNavBar extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentTime: Date.now(),
        }
    }

    submitGame = () => {
        const timeLimit = this.props.game.setting.timeLimitMilliseconds;
        const currentTimeTaken = Date.now() - this.props.game.startTime;
        const finalTime = (currentTimeTaken > timeLimit) ? timeLimit: currentTimeTaken;
        post("api/playerinfo", {userId: this.props.userId, millisecondsToSubmit: finalTime}).then(() => {
            navigate("/scoreboard");
        });
    };


    countdownRenderer = ({ hours, minutes, seconds, completed }) => {
        // console.log(hours+", " + minutes +", " + seconds);
        if (completed) {
          // Render a completed state
          return <span>00:00:00</span>;
        } else {
          // Render a countdown
          return <span>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
        }
    };

    render() {
        let itemIndex = this.props.index;
        let displayBack = (itemIndex !==0) ? (<button onClick = {() => {this.props.onSubmit(-1);}} className = "Navbar-button">
                                                            {"<back/>"}
                                                        </button>) :
                                                        (<div></div>);
        let displayNext = (itemIndex === this.props.numItems - 1) ?  (<button onClick = {this.submitGame} className = "Navbar-button"> 
                                                                                    {"<submit/>"}
                                                                                </button>) :
                                                                                (<button onClick = {() => {this.props.onSubmit(1);}} className = "Navbar-button">
                                                                                    {"<next/>"}
                                                                                </button>);
        // hardcoded limit of time
        const displayTime = this.props.game.setting.timeLimitMilliseconds - (Date.now() - this.props.game.startTime);                                                                 
        return (
            <nav className = "NavBar-container">
                <div>
                    <div>Current Score: {this.props.player.numCorrect}/{this.props.numItems}</div>
                </div>
                <div>
                    <div className = "Navbar-labelContainer">
                        <Countdown 
                            date = {Date.now() + displayTime}
                            renderer = {this.countdownRenderer}
                            onComplete = {this.submitGame}
                        />
                    </div>
                </div>
                <div>
                    {displayBack}
                    {displayNext}
                </div>
            </nav>
        );
    }
}

export default PlayNavBar;
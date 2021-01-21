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
 * @param {(increment {+1, -1}) => void} onSubmit is a function to increment or decrement to
 * move on to the next question
 * @param {Player} player is a player following the player schema
 * @param {number} numItems is the number of hunt items in the hunt
 * @param {number} startTime is the current date and time 
 */
class PlayNavBar extends Component {

    constructor(props){
        super(props);

        this.state = {
            currentTime: Date.now(),
        }
    }

    // get the utc of the current time
    getCurrentUTC = () => {
        // https://stackoverflow.com/questions/948532/how-do-you-convert-a-javascript-date-to-utc
        let date = new Date(); 
        let now_utc =  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(),
                        date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        return new Date(now_utc);
    };

    //for now delete the game and goes home
    submitGame = () => {
        navigate("/scoreboard");
    };

    countdownRenderer = ({ hours, minutes, seconds, completed }) => {
        console.log(hours+", " + minutes +", " + seconds);
        if (completed) {
          // Render a completed state
          return <span>00:00:00</span>;
        } else {
          // Render a countdown
          return <span>{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}</span>;
        }
    };

    render() {
        let itemIndex = this.props.player.currentHuntItemIndex;
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
        const displayTime = 1000*60*5 - (Date.now() - this.props.startTime);                                                                 
        return (
            <nav className = "NavBar-container">
                <div>
                    <div>Current Score: {this.props.player.numCorrect}/{this.props.numItems}</div>
                </div>
                <div>
                    <div>
                        <Countdown 
                            date = {Date.now() + displayTime}
                            renderer = {this.countdownRenderer}
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
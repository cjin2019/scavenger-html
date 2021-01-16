import React, { Component } from "react";
import PlayHunt from "../modules/PlayHunt.js";
import "../../utilities.css";

/**
 * This is the game page that displays starting the game and
 * playing the game
 */
class Game extends Component {
    constructor(props){
        super(props);

        this.state = {
            currentHuntItemIndex: 0
        }
    }

    componentDidMount(){

    }

    // assuming decrementing on all items but first
    // and incrementing on all items but last
    // inc is {+1, -1}
    moveToDifferentQuestion = (inc) => {
        this.setState({
            currentHuntItemIndex: this.state.currentHuntItemIndex + inc,
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

        let display =   (<PlayHunt 
                            huntItem = {data.huntItems[this.state.currentHuntItemIndex]}
                            onSubmit = {this.moveToDifferentQuestion}
                            itemIndex = {this.state.currentHuntItemIndex}
                            numItems = {data.huntItems.length}
                            checkAnswer = {this.checkAnswer}
                        />) ;
        return (
            <div>
                {display}
            </div>

        );
    }
}

export default Game;
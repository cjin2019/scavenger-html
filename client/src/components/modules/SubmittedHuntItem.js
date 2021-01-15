import React, { Component } from "react";
import PartDisplay from "./hunt_item_parts/PartDisplay.js";
import "./SubmittedHuntItem.css";
/**
 * @param {string} scavengerId is optional to keep track of which scavenger it goes with
 * @param {string} _id is the id of the huntItem
 * @param {string} content is an object keyed on question and answer
 */
class SubmittedHuntItem extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {}

    render(){
        return (<div>
                    <div className = "SubmittedHuntItem-container">
                        <h4>Question</h4>
                        <PartDisplay content = {this.props.content.question}/>
                        <h4>Answer</h4>
                        <PartDisplay content = {this.props.content.answer} />
                    </div>
                </div>);
    }
}

export default SubmittedHuntItem;
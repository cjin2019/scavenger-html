import React, { Component } from "react";
import PartDisplay from "./hunt_item_parts/PartDisplay.js";
import PartInput from "./hunt_item_parts/PartInput.js";
/**
 * PlayHuntItem is a component that is displayed on the play hunt that
 * shows the item question and submission for the user answer
 * 
 * Proptypes
 * @param {HuntItem} huntItem is a hunt item following the hunt item schema 
 * 
 */
class PlayHuntItem extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {}

    render(){
        return (<div>
                    <div>
                        <h4>Question</h4>
                        <PartDisplay content = {this.props.huntItem.question}/>
                        <h4>Answer Submission</h4>
                        <PartInput />
                    </div>
                </div>);
    }
}

export default PlayHuntItem;
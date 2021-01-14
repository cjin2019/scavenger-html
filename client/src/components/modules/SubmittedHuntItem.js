import React, { Component } from "react";

/**
 * @param {string} scavengerId is optional to keep track of which scavenger it goes with
 * @param {string} _id is the id of the huntItem
 * @param {SingleItemPart[]} parts is the item parts
 */
class SubmittedHuntItem extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount() {}

    render(){
        <div>
            <div>This is a submitted hunt item</div>

        </div>
    }
}

export default SubmittedHuntItem;
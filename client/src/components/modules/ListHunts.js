import React, { Component } from "react";
import SingleHuntShortcut from "./SingleHuntShortcut.js";

/**
 * ListHunts Component that holds all the hunts for a specified
 * filter (ie. recent, favorite, etc)
 * 
 * Proptypes
 * @param {Hunt[]} hunts
 * @param {String} userId id of the user
 */
class ListHunts extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){

    }

    render(){
        return (
        <div>
            {this.props.hunts.map((hunt) => (
                <SingleHuntShortcut 
                    key = {`SingleHuntt_${hunt._id}`}
                    _id = {hunt._id}
                    title = {hunt.title}
                    description = {hunt.description}
                    userId = {this.props.userId}
                />
            ))}
        </div> );
    }
}

export default ListHunts;
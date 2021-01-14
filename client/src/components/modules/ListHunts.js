import React, { Component } from "react";
import SingleHuntShortcut from "./SingleHuntShortcut.js";

/**
 * Component that holds all the hunts for a specified
 * filter (ie. recent, favorite, etc)
 * 
 * Proptypes
 * @param {SingleHuntShortcut[]} huntShortcuts
 * 
 */
class ListHunts extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(){

    }

    render(){
        console.log(this.props.huntShortcuts);
        return (
        <div>
            {this.props.huntShortcuts.map((huntShortcut) => (
                <SingleHuntShortcut 
                    key = {`SingleHuntShortcut_${huntShortcut._id}`}
                    _id = {huntShortcut._id}
                    title = {huntShortcut.title}
                    description = {huntShortcut.description}
                />
            ))}
        </div> );
    }
}

export default ListHunts;
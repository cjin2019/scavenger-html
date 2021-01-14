import React, { Component } from "react";
import "../../utilities.css";
import ListHunts from "../modules/ListHunts.js"

class UserHome extends Component {
    constructor(props){
        super(props);

        this.state = {};
    }

    componentDidMount(){
        // api calls for later
    }

    render(){
        const defaultData = [
            {
                _id: "1",
                title: "Scavenger Hunt 1",
                description: "This is the first scavenger hunt"
            },
            {
                _id: "2",
                title: "Scavenger Hunt 2",
                description: "This is the second scavenger hunt"
            }
        ];

        return (<div>
            <h1>This is the user home page</h1>
            <ListHunts 
                huntShortcuts = {defaultData}
            />
        </div>);
    }
}

export default UserHome;
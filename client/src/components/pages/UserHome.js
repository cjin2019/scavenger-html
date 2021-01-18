import React, { Component } from "react";
import ListHunts from "../modules/ListHunts.js";
import NavBar from "../modules/NavBar.js";

import { get } from "../../utilities";
import "../../utilities.css";

/**
 * UserHome is a page that displays (for now all hunts)
 * hunts according to user preference (ie. recent hunts played, etc)
 */
class UserHome extends Component {
    constructor(props){
        super(props);

        this.state = {
            hunts: [],
        };
    }

    componentDidMount(){
        // api calls for later
        get("/api/hunt", {creatorId: "creatorId_1", isFinalized: true}).then((hunts) => {

            this.setState({
                hunts: hunts,
            })
        });
    }

    render(){

        return (<div>
            <NavBar />
            <h1>This is the user home page</h1>
            <ListHunts 
                hunts = {this.state.hunts}
                userId = {"creatorId_1"}
            />
        </div>);
    }
}

export default UserHome;
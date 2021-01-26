import React, { Component } from "react";
import ListHunts from "../modules/ListHunts.js";
import NavBar from "../modules/NavBar.js";

import { get, post } from "../../utilities";
import { navigate } from "@reach/router";
import { forceUserLogin } from "./PageFunctions.js";

import "../../utilities.css";
import "./FindHunts.css"

/**
 * Browse is the page that shows all hunts
 * 
 * TODO: DRY out Browse and UserHome Page later
 * 
 * @param {string} userId is the id of the user when logged in
 * @param {() => void} handleLogin is a function to execute when log in is clicked
 * @param {() => void} handleLogout is a function to execute when log out is clicked
 */
class Browse extends Component {
    constructor(props){
        super(props);

        this.state = {
            hunts: [],
            tutorials: [],
        }
    }

    
    componentDidMount(){
        get("/api/hunt", {creatorId: "ALL_USERS", isFinalized: true}).then((res) => {
            this.setState({
                hunts: res.hunts, 
                tutorials: res.tutorials,
            });
        });
    }

    render(){

        let display = (<div>
            <NavBar 
                    handleLogin={this.props.handleLogin}
                    handleLogout={this.props.handleLogout}
                    userId = {this.props.userId}
            />
            <div className = "FindHunts-container">
                <h1 className = "FindHunts-title">Tutorials</h1>
                <ListHunts 
                    hunts = {this.state.tutorials}
                    userId = {this.props.userId}
                />
            </div>
            <div className = "FindHunts-container">
                <h1 className = "FindHunts-title">All scavenger hunts</h1>
                <ListHunts 
                    hunts = {this.state.hunts}
                    userId = {this.props.userId}
                />
            </div>
        </div>);

        return forceUserLogin(this.props.userId, display);
    }
}

export default Browse;
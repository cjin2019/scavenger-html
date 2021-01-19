import React, { Component } from "react";
import ListHunts from "../modules/ListHunts.js";
import NavBar from "../modules/NavBar.js";

import { get, post } from "../../utilities";
import "../../utilities.css";
import { navigate } from "@reach/router";

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
        }
    }

    
    componentDidMount(){
        get("/api/hunt", {creatorId: "ALL_USERS", isFinalized: true}).then((hunts) => {
            this.setState({
                hunts: hunts, 
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
            <h1>All scavenger hunts</h1>
            <ListHunts 
                hunts = {this.state.hunts}
                userId = {this.props.userId}
            />
        </div>);

        let displayLogin = (<div>
            <div>Go to login page first</div>
            <button onClick = {() => navigate("/")}>{"<home/>"}</button>
        </div>);
        return (<div>
                {this.props.userId ? display : displayLogin}
                </div>);
    }
}

export default Browse;
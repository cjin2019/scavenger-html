import React, { Component } from "react";
import ListHunts from "../modules/ListHunts.js";
import NavBar from "../modules/NavBar.js";

import { get, post } from "../../utilities";
import { navigate } from "@reach/router";

import "../../utilities.css";
import "./FindHunts.css"
import "./Help.css";
import "../modules/NavBar.css";
import sound from "../../public/correct_audio.mp3";

/**
 * UserHome is a page that displays (for now all hunts)
 * hunts according to user preference (ie. recent hunts played, etc)
 * 
 * Proptypes
 * @param {string} userId is the id of the user when logged in
 * @param {() => void} handleLogin is a function to execute when log in is clicked
 * @param {() => void} handleLogout is a function to execute when log out is clicked
 * @param {(callback function) => void} getUser is a function to execute when reloading and making sure
 * user is not undefined
 */

const likeAudio = new Audio(sound);

class UserHome extends Component {
    constructor(props){
        super(props);

        this.state = {
            hunts: [],
            user: {
                name: "",
                _id: "",
            },
        };
    }

    
    getInitialHomeValues = () => {
        if(this.props.userId){
            get("/api/user", {userId: this.props.userId}).then((user) => {
                this.setState({
                    user: user
                });
                get("/api/hunt", {creatorId: user._id, isFinalized: true}).then((hunts) => {
                    this.setState({
                        hunts: hunts, 
                    });
                });
            });
        } else {
            navigate("/");
        }
    }

    componentDidMount(){
        // api calls for later
        this.props.getUser(() => {
            this.getInitialHomeValues();
        });

    }

    playSound = () => {
        likeAudio.play();
    }

    render(){

        let display = (<div className = "FindHunts-container">
            {this.state.hunts.length === 0 ? 
            (<div>
                <h1>Read the instructions below!</h1>
                <div className = "FindHunts-instruction">
                    <p>Welcome to Scavenger html! If you are a first time user, 
                    go to the<button onClick = {() => {navigate("/help")}} className = "Navbar-icon Navbar-help"></button>
                    help page. 
                    </p> 
                    <p> 
                    Otherwise, click 
                    <button className = "Help-buttonSection" onClick = {() => navigate("/browse")}>{"<browse/>"}</button>
                    to play one of the hunts, 
                    <button className = "Help-buttonSection" onClick = {() => navigate("/join")}>{"<join/>"}</button>
                    to join an existing game through a join code, or
                    <button className = "Help-buttonSection" onClick = {() => navigate("/create")}>{"<create/>"}</button>
                    to create a new hunt. </p>
                </div>
            </div>) : 
            (<div>
                <h1 className = "FindHunts-title">Your created scavenger hunts</h1>
                <ListHunts 
                    hunts = {this.state.hunts}
                    userId = {this.props.userId}
                />
            </div>
            )}
        </div>);

        return (<div>
                <NavBar 
                    handleLogin={this.props.handleLogin}
                    handleLogout={this.props.handleLogout}
                    userId = {this.props.userId}
                    getUser = {this.props.getUser}
                />
                {display}
                <button onClick = {this.playSound}>Credit to zapsplat.com for sound effects</button>
                </div>);
    }
}

export default UserHome;
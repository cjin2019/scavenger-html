import React, { Component } from "react";
import NavBar from "../modules/NavBar.js";
import { forceUserLogin } from "./PageFunctions.js";
import { navigate } from "@reach/router";

import "../../utilities.css";
import "./Help.css";
import "../modules/NavBar.css";
/**
 * Help Page to tell users what this website is about and how to use it
 * 
 * Proptypes
 * @param {string} userId is the id of the user when logged in
 * @param {() => void} handleLogin is a function to execute when log in is clicked
 * @param {() => void} handleLogout is a function to execute when log out is clicked
 * @param {(callback function) => void} getUser is a function to execute when reloading and making sure
 * user is not undefined
 */
class Help extends Component {
    constructor(props){
        super(props);
    }
    render(){
        let display = (<div>
            <NavBar 
                handleLogin={this.props.handleLogin}
                handleLogout={this.props.handleLogout}
                userId = {this.props.userId}
                getUser = {this.props.getUser}
            />
            <div className = "Help-container">
                <h1>Help Page</h1>
                <div className = "Help-sectionContainer">
                    <h2>Background</h2>
                    <div>
                        <p>
                            Welcome Scavenger html, a website that allows users to play html 
                            themed scavenger hunts with their friends! Users can play a hunt game by creating,
                            browsing for existing hunts, of joining a game of hunt with their friends! If you play a hunt
                            with three players, you can earn points for placing among the top 3.
                            If you can collect enough points to earn html tags. More info about the point system
                            in the section below. 
                        </p>
                        <p> 
                            If you are a first time user, try the scavenger hunt 
                            tutorial in the 
                            <button className = "Help-buttonSection"
                                    onClick = {() => {navigate("/browse")}}
                            >
                                {"<browse/>"}
                            </button>
                            page to see how a typical game works.
                        </p> 
                    </div>
                </div>
                <div className = "Help-sectionContainer">
                    <h2>Point System</h2>
                    <div>
                        <p>
                            The top 3 players of a hunt game earn points. A player among the top 3 earns
                            <b> 2 * (number of players - rank) + 1</b> points. For every 10 points players earn,
                            an html tag is added to their 
                            <button className = "Navbar-icon Navbar-profile" 
                                onClick = {() => {navigate("/profile")}}
                            >
                            </button>profile page. An <b> {" <html/> "}</b> tag is already added by default. 
                        </p>
                    </div>
                </div>
                <div className = "Help-sectionContainer">
                    <h2>Credits</h2>
                    <div>
                        All sound effects are from <a href = "https://www.zapsplat.com/" className = "Help-link">Zapsplat.com</a>
                    </div>
                </div>
            </div>
        </div>)
        return forceUserLogin(this.props.userId, display);
    }
}

export default Help;
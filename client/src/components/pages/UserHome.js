import React, { Component } from "react";
import ListHunts from "../modules/ListHunts.js";
import NavBar from "../modules/NavBar.js";

import { get, post } from "../../utilities";
import { navigate } from "@reach/router";

import "../../utilities.css";
import "./FindHunts.css"
import "./Help.css";
import "../modules/NavBar.css";

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

class UserHome extends Component {
    constructor(props){
        super(props);

        this.state = {
            create: [],
            recent: [],
        };
    }

    
    getInitialHomeValues = () => {
        if(this.props.userId){
            // get("/api/hunt", {creatorId: this.props.userId, isFinalized: true}).then((hunts) => {
            //     this.setState({
            //         hunts: hunts, 
            //     });
            // });
            get("api/filterhunts", {userId: this.props.userId}).then((hunts) => {
                this.setState({
                    create: hunts.create,
                    recent: hunts.recent,
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

    render(){

        let display = (<div>
            {(this.state.recent.length === 0 && this.state.create.length === 0)? 
            (<div className = "FindHunts-container">
                <h1>Read the instructions below!</h1>
                <div className = "FindHunts-instruction">
                    <p>Welcome to Scavenger html!<span>If you are a first time user, 
                    go to the<button onClick = {() => {navigate("/help")}} className = "Navbar-icon Navbar-help"></button>
                    help page and try the tutorial in the <button className = "Help-buttonSection" onClick = {() => navigate("/browse")}>{"<browse/>"}</button>
                    page!</span> 
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
            (<div >
                {this.state.recent.length > 0 ? (<div className = "FindHunts-container">
                    <h1 className = "FindHunts-title">Recent scavenger hunts played</h1>
                    <ListHunts 
                        hunts = {this.state.recent}
                        userId = {this.props.userId}
                    />
                </div>): (<div></div>)}
                {this.state.create.length > 0 ? (<div className = "FindHunts-container">
                    <h1 className = "FindHunts-title">Your created scavenger hunts</h1>
                    <ListHunts 
                        hunts = {this.state.create}
                        userId = {this.props.userId}
                    /> 
                </div>): (<div></div>)}
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
                </div>);
    }
}

export default UserHome;
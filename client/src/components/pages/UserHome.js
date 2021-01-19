import React, { Component } from "react";
import ListHunts from "../modules/ListHunts.js";
import NavBar from "../modules/NavBar.js";

import { get, post } from "../../utilities";
import "../../utilities.css";

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
            <h1>Your created scavenger hunts</h1>
            {this.state.hunts.length === 0 ? 
            (<div>You have no created hunts go to browse to play a hunt or to create to create one</div>) : 
            (<ListHunts 
                hunts = {this.state.hunts}
                userId = {this.state.user._id}
            />)}
        </div>);

        return (<div>
                <NavBar 
                    handleLogin={this.props.handleLogin}
                    handleLogout={this.props.handleLogout}
                    userId = {this.props.userId}
                />
                <div></div>
                {this.props.userId ?
                    display :
                    (<div>Please login to gain access to the userhome</div>)
                    }
                </div>);
    }
}

export default UserHome;
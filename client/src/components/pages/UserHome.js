import React, { Component } from "react";
import ListHunts from "../modules/ListHunts.js";
import NavBar from "../modules/NavBar.js";

import { get } from "../../utilities";
import "../../utilities.css";

/**
 * UserHome is a page that displays (for now all hunts)
 * hunts according to user preference (ie. recent hunts played, etc)
 * 
 * Proptypes
 * @param {string} userId is the id of the user when logged in
 * @param {() => void} handleLogin is a function to execute when log in is clicked
 * @param {() => void} handleLogout is a function to execute when log out is clicked
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

        let display = (<div>
            <h1>This is the user home page</h1>
            <ListHunts 
                hunts = {this.state.hunts}
                userId = {"creatorId_1"}
            />
        </div>);

        return (<div>
                <NavBar 
                    handleLogin={this.props.handleLogin}
                    handleLogout={this.props.handleLogout}
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
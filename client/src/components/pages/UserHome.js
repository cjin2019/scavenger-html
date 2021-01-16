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
            huntShortcuts: [],
        };
    }

    componentDidMount(){
        // api calls for later
        get("/api/hunt").then((hunts) => {
            const huntShortcuts = hunts.map((hunt) => (
                {
                    _id: hunt._id,
                    title: hunt.title,
                    description: hunt.description
                }
            ));

            this.setState({
                huntShortcuts: huntShortcuts,
            })
        });
    }

    render(){

        return (<div>
            <NavBar />
            <h1>This is the user home page</h1>
            <ListHunts 
                huntShortcuts = {this.state.huntShortcuts}
            />
        </div>);
    }
}

export default UserHome;
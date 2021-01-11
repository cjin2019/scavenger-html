import React, { Component } from "react";
import "../../utilities.css";

class UserHome extends Component {
    constructor(props){
        super(props);

        this.state = {};
    }

    componentDidMount(){
        // api calls for later
    }

    render(){
        return <div>
            <h1>This is the user home page</h1>
        </div>
    }
}

export default UserHome;
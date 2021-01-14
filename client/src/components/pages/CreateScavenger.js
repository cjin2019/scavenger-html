import React, { Component } from "react";
import "../../utilities.css";

class CreateScavenger extends Component {
    constructor(props){
        super(props);

        this.state = {
            huntItems: [],
        };
    }

    componentDidMount(){
        // api calls for later
    }

    // this gets called when the user pushes "Add", so their
    // question for the scavenger gets added to the screen
    // dummy function for now but later will want to change the format of 
    // the question
    addNewHuntItem = (huntItemObj) => {
        this.setState({
            huntItems: this.state.huntItems.concat([huntItemObj]),
        });
    }

    render(){

        return (<div>
            <h1>This is the create page</h1>
        </div>);
    }
}

export default CreateScavenger;
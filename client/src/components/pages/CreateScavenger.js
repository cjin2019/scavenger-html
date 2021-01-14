import React, { Component } from "react";
import "../../utilities.css";
import NewHuntItem from "../modules/NewHuntItem.js";
import SubmittedHuntItem from "../modules/SubmittedHuntItem";

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
        console.log(huntItemObj);
        this.setState({
            huntItems: this.state.huntItems.concat([huntItemObj]),
        });

        console.log(this.state.huntItems);
    }

    render(){

        return (<div>
            <h1>This is the create page</h1>
            { this.state.huntItems.map((huntItemObj) => (
                <SubmittedHuntItem 
                    content = {huntItemObj}
                />
            ))}
            <NewHuntItem 
                onSubmit = {this.addNewHuntItem}
            />
        </div>);
    }
}

export default CreateScavenger;
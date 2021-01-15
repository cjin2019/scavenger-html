import React, { Component } from "react";
import { get, post } from "../../utilities";
import NewHuntItem from "../modules/NewHuntItem.js";
import SubmittedHuntItem from "../modules/SubmittedHuntItem";

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
        get("/api/huntitem").then((huntItems) => {
            console.log(huntItems);
            this.setState({
                huntItems: huntItems
            });
        });
    }

    // this gets called when the user pushes "Add", so their
    // question for the scavenger gets added to the screen
    // dummy function for now but later will want to change the format of 
    // the question
    addNewHuntItem = (huntItemObj) => {
        const body = { _id: "hardcode1",
                       question: huntItemObj.question,
                       answer: huntItemObj.answer
                     };
        post("/api/huntitem", body). then((huntItem) => {
            this.setState({
                huntItems: this.state.huntItems.concat([huntItemObj]),
            });
        });
    }

    render(){

        let huntList = null;
        const hasHuntItems = this.state.huntItems.length
        return (<div>

            { this.state.huntItems.map((huntItemObj) => (
                <SubmittedHuntItem 
                    key = {`HuntItem_${huntItemObj._id}`}
                    _id = {huntItemObj._id}
                    content = {huntItemObj}
                />
            ))}
            <NewHuntItem 
                onSubmit = {this.addNewHuntItem}
            />

            <button />
        </div>);
    }
}

export default CreateScavenger;
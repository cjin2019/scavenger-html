import React, { Component } from "react";
import { get, post } from "../../utilities";
import NewHuntItem from "../modules/NewHuntItem.js";
import SubmittedHuntItem from "../modules/SubmittedHuntItem";

import "../../utilities.css";

class CreateScavenger extends Component {
    constructor(props){
        super(props);

        this.state = {
            title: "",
            description: "",
            huntItems: [],
        };
    }

    componentDidMount(){
        // api calls for later
        get("/api/huntitem").then((huntItems) => {
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
        post("/api/huntitem", body).then((huntItem) => {
            this.setState({
                huntItems: this.state.huntItems.concat([huntItemObj]),
            });
        });
    }

    handleSubmit = (event) => {
        const body = {
                        _id: "hardcode1",
                        title: this.state.title,
                        description: this.state.description,
                        huntItems: this.state.huntItems
                     };
        post("/api/hunt", body);
    }

    handleTitleChange = (event) => {
        this.setState({
            title: event.target.value,
        });
    }

    handleDescriptionChange = (event) => {
        this.setState({
            description: event.target.value,
        });
    }

    render(){
        return (
        <div>
            <button
                type = "submit"
                value = "Submit"
                onClick = {this.handleSubmit}    
            >
                Submit
            </button>
            <div>
                <div>
                    <h3>Title</h3>
                    <input
                        type = "text"
                        placeholder = "title"
                        value = {this.state.title}
                        onChange = {this.handleTitleChange}
                    />
                </div>
                <div>
                    <h3>Description</h3>
                    <input
                        type = "text"
                        placeholder = "Description"
                        value = {this.state.description}
                        onChange = {this.handleDescriptionChange}
                    />
                </div>
            </div>
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
        </div>);
    }
}

export default CreateScavenger;
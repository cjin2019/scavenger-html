import React, { Component } from "react";
import NewHuntItem from "../modules/NewHuntItem.js";
import SubmittedHuntItem from "../modules/SubmittedHuntItem";
import CreateNavBar from "../modules/CreateNavBar";

import { get, post } from "../../utilities";

import "../../utilities.css";

/**
 * CreateScavenger is a page to create a new scavenger hunt
 * 
 */
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
        // get("/api/huntitem").then((huntItems) => {
        //     this.setState({
        //         huntItems: huntItems
        //     });
        // });
        

    }

    // this gets called when the user pushes "Add", so their
    // question for the scavenger gets added to the screen
    // dummy function for now but later will want to change the format of 
    // the question
    addNewHuntItem = (huntItemObj) => {
        const body = { _id: `hardcode1_${Math.random()*10000}`,
                       question: huntItemObj.question,
                       answer: huntItemObj.answer
                     };
        // post("/api/huntitem", body).then((huntItem) => {
        //     this.setState({
        //         huntItems: this.state.huntItems.concat([huntItemObj]),
        //     });
        // });
        this.setState({
            huntItems: [...this.state.huntItems, huntItemObj],
        });
    }

    /**
     * 
     * @param {*} event the event 
     */
    handleSubmit = (event) => {
        const body = {
                        creatorId: `creatorId_${Math.random()*10000}`,
                        title: this.state.title,
                        description: this.state.description,
                        huntItems: this.state.huntItems
                     };
        post("/api/createhunt", body);
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
            <CreateNavBar handleSubmit = {this.handleSubmit}/>
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
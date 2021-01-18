import React, { Component } from "react";
import NewHuntItem from "../modules/NewHuntItem.js";
import SubmittedHuntItem from "../modules/SubmittedHuntItem";
import CreateNavBar from "../modules/CreateNavBar";

import { get, post } from "../../utilities";
import { navigate } from "@reach/router";

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
            huntId: null,
            description: "",
            huntItems: [],
        };

    }

    loadSavedHuntItems = (huntId) => {
        get("api/savedhuntitem", {huntId: huntId}).then((huntItems) => {
            this.setState({
                huntItems: [...this.state.huntItems, ...huntItems],
            });
        });
    };

    initializeTemplate = (hunt, creatorId) => {
        if(confirm("You have an unsubmitted hunt. Do you want to complete this hunt?")){
            this.setState({
                huntId: hunt._id,
            });
            console.log("load already created template");
            this.loadSavedHuntItems(hunt._id);
        } else {
            post("api/hunt", {huntId: hunt._id, 
                            action: "delete"}).then(() => {
                                this.createHunt(creatorId);
                            });
        }
    };

    createHunt = (creatorId) => {
        post("api/hunt", {creatorId: creatorId, 
                          action: "add",
                          isFinalized: false,
                        }).then((hunt) => {
            console.log("created hunt template");
            this.setState({
                huntId: hunt._id,
            });
        });
    }

    loadSavedHunt = (creatorId) => {
        get("api/hunt", {creatorId: creatorId, 
                         isFinalized: false,
                        }).then((unsubmittedHunts) => {
            console.log("unsubmitted hunts " + unsubmittedHunts);
            if(unsubmittedHunts.length === 0){
                this.createHunt(creatorId);
            } else{
                this.initializeTemplate(unsubmittedHunts[0], creatorId);
            }
        });
    };

    componentDidMount(){
        const  creatorId = "creatorId_1";
        this.loadSavedHunt(creatorId);
    }


    // this gets called when the user pushes "Add", so their
    // question for the scavenger gets added to the screen
    // dummy function for now but later will want to change the format of 
    // the question
    addNewHuntItem = (huntItemObj) => {
        let body = {
            huntId: this.state.huntId,
            question: huntItemObj.question,
            answer: huntItemObj.answer,
        }
        post("api/savedhuntitem", body).then((huntItem) => {
            console.log("successfully saved huntitem");
            this.setState({
                huntItems: [...this.state.huntItems, huntItem],
            });
        });
    }

    /**
     * 
     * @param {*} event the event 
     */
    handleSubmit = (event) => {
        const body = {
                        creatorId: "creatorId_1",
                        add: "update",
                        title: this.state.title,
                        description: this.state.description,
                        huntId: this.state.huntId,
                     };
        post("/api/hunt", body).then(() => {
            navigate("/userhome");
        });
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
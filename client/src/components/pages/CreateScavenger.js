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
            createId: null,
            description: "",
            huntItems: [],
        };

    }

    loadSavedItems = (pageId) => {
        if(confirm("Do you want to load previous create progress?")){
            return pageId;
        } else{
            post("api/createpage", {userId: "creatorId_1", action: "delete"});
            return null;
        }
    };

    componentDidMount(){
        
        let body = {
            userId: "creatorId_1",
            action: "add",
        };

        get("api/createpage", body).then((createpages) => {
            let pageId = null;
            if(createpages.length !== 0){
                pageId = this.loadSavedItems(createpages[0]._id);
                get("api/savedhuntitem", {createId: pageId}).then((savedHuntItems) => {
                    console.log("Got saved hunt items");
                    console.log(savedHuntItems);
                    this.setState({
                        huntItems: [...this.state.huntItems, ...savedHuntItems],
                    });
                });
            } 
            if(pageId === null){
                post("api/createpage", body).then((createpage) => {
                    pageId = createpage._id;
                });
            }

            this.setState({
                createId: pageId
            });
        });
    }


    // this gets called when the user pushes "Add", so their
    // question for the scavenger gets added to the screen
    // dummy function for now but later will want to change the format of 
    // the question
    addNewHuntItem = (huntItemObj) => {
        let body = {
            createId: this.state.createId,
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
                        title: this.state.title,
                        description: this.state.description,
                        createId: this.state.createId,
                     };
        post("/api/createhunt", body).then(() => {
            post("api/createpage", {userId: "creatorId_1", action: "delete"}).then(() => {
                console.log("deleted 1 page");
                navigate("/userhome");
            });
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
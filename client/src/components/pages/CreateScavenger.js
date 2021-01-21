import React, { Component } from "react";
import NewHuntItem from "../modules/NewHuntItem.js";
import SubmittedHuntItem from "../modules/SubmittedHuntItem";
import CreateNavBar from "../modules/CreateNavBar";

import { get, post } from "../../utilities";
import { navigate } from "@reach/router";
import { forceUserLogin } from "./PageFunctions.js";

import "../../utilities.css";
import "./CreateScavenger.css";


/**
 * CreateScavenger is a page to create a new scavenger hunt
 * 
 * Constraints don't allow the user to submit if there are no hunt items!
 * 
 * Proptypes
 * @param {string} userId id of the user
 * @param {() => void} getCurrentUser calls a function in app to get the current user
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
            this.setState({
                huntId: hunt._id,
            });
        });
    }

    loadSavedHunt = (creatorId) => {
        get("api/hunt", {creatorId: creatorId, 
                         isFinalized: false,
                        }).then((unsubmittedHunts) => {
            if(unsubmittedHunts.length === 0){
                this.createHunt(creatorId);
            } else{
                this.initializeTemplate(unsubmittedHunts[0], creatorId);
            }
        });
    };

    loadUserCreateTemplate = () => {
        if(this.props.userId){
            get("api/user", {userId: this.props.userId}).then((user) => 
                {this.loadSavedHunt(user._id);}
            );
        }
    };

    componentDidMount(){
        this.props.getUser(this.loadUserCreateTemplate);
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
        if(this.state.huntItems.length > 0){
            const body = {
                creatorId: this.props.userId,
                add: "update",
                title: this.state.title,
                description: this.state.description,
                huntId: this.state.huntId,
             };
             post("/api/hunt", body).then(() => {
                navigate("/userhome");
            });
        } else {
            alert("You must submit at least one hunt item");
        }
        
        
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
        let display = (
        <div>
            <CreateNavBar 
                handleSubmit = {this.handleSubmit}
                huntId = {this.state.huntId}
            />
            <div className = "CreateScavenger-basicinfocontainer">
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

        return forceUserLogin(this.props.userId, display);
    }
}

export default CreateScavenger;
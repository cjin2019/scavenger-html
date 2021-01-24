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
            description: "",
            huntItems: [],
        };

    }

    /**
     * 
     * @param {Object} template and object with the hunt and huntItems field 
     */
    setIntialState = (template) => {
        this.setState({
            title: template.hunt.title,
            description: template.hunt.description,
            huntItems: template.huntItems
        });
    }

    loadSavedHunt = () => {
        if(this.props.userId){
            get("api/hunttemplate", {creatorId: this.props.userId}).then((msg) => {
                let reuse = false;
                if(msg.huntExists){
                    if(confirm("You have an unsubmitted hunt. Do you want to complete this hunt?")){
                        reuse = true;
                    }
                }
                post("api/createhunttemplate", {creatorId: this.props.userId, reuse: reuse}).then((template) => {
                    this.setIntialState(template);
                });
            })
        }
    };

    componentDidMount(){
        this.props.getUser(this.loadSavedHunt);
    }

    addNewHuntItem = (huntItemObj) => {
        let body = {
            creatorId: this.props.userId,
            question: huntItemObj.question,
            answer: huntItemObj.answer,
        }
        if(huntItemObj.question === "" || huntItemObj.answer === ""){
            alert("You cannot an empty question and/or answer field");
        } else {
            post("api/newhuntitem", body).then((huntItem) => {
                this.setState({
                    huntItems: [...this.state.huntItems, huntItem],
                });
            });
        }
    }

    handleSubmit = () => {
        console.log(this.state);
        console.log(this.state.title !== "" && this.state.description !== "");
        if(this.state.huntItems.length > 0 && this.state.title !== "" && this.state.description !== ""){
            const body = {
                title: this.state.title,
                description: this.state.description,
                creatorId: this.props.userId,
             };
             post("/api/createhunt", body).then(() => {
                navigate("/userhome");
            });
        } else {
            alert("You must submit at least one hunt item and have a nonempty title and description!");
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
                userId = {this.props.userId}
            />
            <div className = "CreateScavenger-container">
                <div className = "CreateScavenger-basicinfocontainer">
                    <div>
                        <h3>Title</h3>
                        <input
                            type = "text"
                            placeholder = "title"
                            value = {this.state.title}
                            onChange = {this.handleTitleChange}
                            className = "CreateScavenger-basicInfo"
                        />
                    </div>
                    <div>
                        <h3>Description</h3>
                        <textarea
                            type = "textarea"
                            placeholder = "Description"
                            value = {this.state.description}
                            onChange = {this.handleDescriptionChange}
                            className = "CreateScavenger-basicInfo CreateScavenger-description"
                        />
                    </div>
                </div>
                { this.state.huntItems.map((huntItemObj) => (
                    <SubmittedHuntItem 
                        key = {`HuntItem_${Math.random()*1000000}`}
                        content = {huntItemObj}
                    />
                ))}
                <NewHuntItem 
                    onSubmit = {this.addNewHuntItem}
            />
            </div>
            
        </div>);

        return forceUserLogin(this.props.userId, display);
    }
}

export default CreateScavenger;
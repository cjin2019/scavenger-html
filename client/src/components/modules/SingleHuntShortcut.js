import React, { Component } from "react";
import { navigate } from "@reach/router";
import { get, post } from "../../utilities";

import "./SingleHuntShortcut.css";
/**
 * SingleHuntShortcut is a component to render a single hunt
 * shortcut for the user to choose from
 * 
 * Proptypes
 * @param {String} userId id of the user
 * @param {string} _id of the hunt
 * @param {string} title of the hunt
 * @param {string} description of the hunt
 * 
 */
class SingleHuntShortcut extends Component {
    constructor(props) {
        super(props);

    }

    postNewGame = (body) => {
        post("api/game", body).then(() => {
            navigate("/newgame");
        });
    };

    setRedirect = () => {
        let body = {
            huntId: this.props._id,
            creatorId: this.props.userId
        }

        get("api/game", {creatorId: this.props.userId}).then((game) => { //in case game has not been deleted yet!
            if(game._id){
                post("api/game", {gameId: game._id, action: "delete"}).then(() => {
                    this.postNewGame(body);
                });
            } else{
                this.postNewGame(body);
            }
        });
        
    }
    
    render(){
        let page = (
            <div className="SingleHuntShortcut-outerContainer">
                <div className="SingleHuntShortcut-container">
                    <div className = "SingleHuntShortcut-info"> 
                        <div className = "u-bold">{this.props.title}</div>
                        <div className = "SingleHuntShortcut-description">{this.props.description}</div>
                    </div>
                    <div>
                        <button onClick = {this.setRedirect}
                            className = "SingleHuntShortcut-playbutton"
                        >
                        </button>
                    </div>
                </div>
            </div>);
        return page;
    }
}

export default SingleHuntShortcut;
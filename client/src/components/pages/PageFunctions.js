import React from "react";
import { navigate } from "@reach/router";
import "./ButtonPage.css"
import "./ForceUserLogin.css";

/**
 * @param {string} userId the id of the user
 * @param {Component} display what to display if the user is logged in
 */
const forceUserLogin = (userId, display) => {
    let displayLogin = (<div className = "ForceUserLogin-container">
        <h1>Go to login page first</h1>
        <button 
            onClick = {() => navigate("/")}
            className = "ButtonPage-button"
        >
            {"<home/>"}
        </button>
    </div>);
    return (<div>
        {userId ? display : displayLogin}
        </div>);
}

export { forceUserLogin }
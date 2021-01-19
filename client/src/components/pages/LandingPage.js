import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import "../../utilities.css";

// TODO: Change to your own! process.env.REACT_APP_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = "649018652594-90vdqirplrmshf7ua84tpegb7dvsf7u7.apps.googleusercontent.com";

/**
 * This is the landing page where users can sign in
 * @param {string} userId is the id of the user when logged in
 * @param {() => void} handleLogin is a function to execute when log in is clicked
 * @param {() => void} handleLogout is a function to execute when log out is clicked
 */

class LandingPage extends Component {
    constructor(props){
        super(props);
    }

    render(){
        return (<div>
            <h1>Welcome to Scavenger html! Push the login button to start
            </h1>
            {this.props.userId ? (
                <div>
                    <GoogleLogout
                        clientId={GOOGLE_CLIENT_ID}
                        buttonText="Logout"
                        onLogoutSuccess={this.props.handleLogout}
                        onFailure={(err) => console.log(err)}
                    />
                </div>
                
                ) : (
                <GoogleLogin
                    clientId={GOOGLE_CLIENT_ID}
                    buttonText="Login"
                    onSuccess={this.props.handleLogin}
                    onFailure={(err) => console.log(err)}
                />
            )}
        </div>)
    }
}

export default LandingPage;
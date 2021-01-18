import React, { Component } from "react";
import GoogleLogin, { GoogleLogout } from "react-google-login";
import "../../utilities.css";

// TODO: Change to your own! process.env.REACT_APP_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_ID = "121479668229-t5j82jrbi9oejh7c8avada226s75bopn.apps.googleusercontent.com";

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
                    <h1>Hello {this.props.userId}</h1>
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
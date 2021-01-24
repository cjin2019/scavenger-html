import React, { Component} from "react";
import "../../utilities.css";
import "./SettingInput.css";
import "../component_utilities.css";
import "./hunt_item_parts/HuntItem.css";

/**
 * SettingInput is a component to configure the settings of a game
 * 
 * Proptypes
 * @param {string} settingKey the setting part that we want to change
 * @param {string} settingValue the value in the input
 * @param {(event, string) => void} onChange is the function to execute when value is changed
 * 
 */
class SettingInput extends Component {
    constructor(props){
        super(props);
    }

    onChange = (event) => {
        this.props.onChange(event, this.props.settingKey);
    }
    render(){
        return (<div className = "SettingInput-container">
            <input
                type = "text"
                placeholder = {this.props.settingKey}
                value = {this.props.settingValue}
                onChange = {this.onChange}
                className = "cu-inputTextContainer"
            />
        </div>);
    }
}

export default SettingInput;
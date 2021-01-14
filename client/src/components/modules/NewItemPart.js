import React, { Component } from "react";
import PropTypes from "prop-types";

/**
 * ItemPart is a component for displaying a part of the scavenger hunt item
 * 
 * Proptypes
 * @param {string} huntItemId of the huntItem
 * @param {NewItemPart.propTypes} itemType of the item part (eg. question, answer, etc)
 * @param {string} content of the question
 * @param {(value) => void} onChange (function) triggered when this item input is changed
 */

 class NewItemPart extends Component {
     constructor(props){
         super(props);
     }

     handleChange = (event) => {
         event.preventDefault();
         this.props.onChange && this.props.onChange(event.target.value);
     };

     componentDidMount() {}

     render() {
         return (
             <>
                <div>This is an Item Part</div>
                <input
                    type = "text"
                    placeholder = {this.props.itemType}
                    value = {this.props.content}
                    onChange = {this.handleChange}
                />
             </>
             
         );
     }
 }

 //https://jaketrent.com/post/expose-enum-props-in-react
 const types = {
    question: 'question',
    answer: 'answer',
  };
  
  NewItemPart.propTypes = {
    types : PropTypes.oneOf(Object.keys(types))
  };

  NewItemPart.types = types;

 export default NewItemPart;
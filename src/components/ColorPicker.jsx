import React, { useState } from 'react';
import { TwitterPicker } from 'react-color';
import constants from '../helpers/constants';

const ColorPicker = (props) => {
    let [color, updateColor] = useState({ color: constants.blackColor })
    return <TwitterPicker triangle='hide' color={color.color} onChangeComplete={(color) => {
  	props.setColor(color);
  	updateColor({color})
  }}/>;
}

export default ColorPicker;
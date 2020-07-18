import React, { useState } from 'react';
import constants from '../helpers/constants'

const ColorPicker = (props) => {
    let [width, updateWidth] = useState({ width: constants.lineWidthOne })
    return <div> Stroke width: <input type='text' value={width.width} onChange={(e) => {
  	updateWidth({width:e.target.value});
  	props.setWidth(e.target.value);
  }}/></div>;
}

export default ColorPicker;
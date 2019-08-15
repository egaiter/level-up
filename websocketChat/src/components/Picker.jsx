import React from 'react';
import './Picker.css';

function Picker(props)
{
  let output = (
    <div className="pickerList">
      {props.items.map(item =>
      <div className="pickerListItem" key={item.name}>
        <label htmlFor={item.name} >{item.label}</label>
        <input
          type="radio"
          name={props.name}
          value={item.value}
          onChange={props.onChange}
          />
      </div>
    )}
    <div className="clearFloat"/>
    </div>
  )
  return output;
}

export default Picker

import React, { useState } from 'react';
import { TextInput, Button } from '@carbon/react';
import axios from "axios";
import "./Keys.scss";
import { useNavigate } from 'react-router-dom';

const Keys = () => {
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const navigate = useNavigate();

  const handleInputChange1 = (event) => {
    setInput1(event.target.value);
  };

  const handleInputChange2 = (event) => {
    setInput2(event.target.value);
  };

  const handleSubmit = async () => {
    const response = await axios.post('http://localhost:5000/get-keys', {
      GENAI_KEY: input1,
      PROJECT_ID: input2
    });
    navigate('/screen1');
  };

  return (
    <div className='keys'>
      <div className='app'>
        <h1>Please enter your environment keys</h1>
        <br/>
      <TextInput 
        type="text" 
        labelText="Input GENAI_KEY" 
        id="text-input-1" 
        value={input1} 
        onChange={handleInputChange1} 
      />
      <br/><br/><br/>
      <TextInput 
        type="text" 
        labelText="Input PROJECT_ID" 
        id="text-input-2" 
        value={input2} 
        onChange={handleInputChange2} 
      />
      <br/><br/><br/>
        <Button className='submit-button' onClick={handleSubmit}>Submit</Button>
      </div>
      <footer className="bg-gray-100">
        <p className="text-sm">IBM Client Engineering </p>
      </footer>
    </div>
  );
};

export default Keys;

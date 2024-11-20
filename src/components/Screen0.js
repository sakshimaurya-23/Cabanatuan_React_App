import React from 'react';
import './Screen0.scss';
import { Link } from 'react-router-dom';
import { Button } from '@carbon/react';

const Screen0 = ({ videoUrl }) => {
  return (
    <div className='screen0'>
      <div className="app">
      <div className="content-container">
        <div className="text-container">
          <h1>Talk to your data</h1>
          <br />
          <h4>Role-Based Interactions</h4>
          <br />
          <Link to="/Screen1">
            <Button>
              START
            </Button>
          </Link>
        </div>
        <div className="video-container">
          <video autoPlay muted>
            <source src="./IBM_watsonx_ai_animation.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      <footer className="bg-gray-100">
        <p className="text-sm">IBM Client Engineering </p>
      </footer>
    </div>
    </div>
    </div>
  );
};

export default Screen0;
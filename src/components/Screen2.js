import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { TextArea, Button, ContainedList, ContainedListItem, SkeletonText } from '@carbon/react';
import './Screen2.scss';
import { ThumbsUp, ThumbsDown, Send } from '@carbon/icons-react';
import { Link } from 'react-router-dom';

const getTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

const showSource = async() => {
  document.getElementById('tables0').style.display = 'none';
  document.getElementById('tables1').style.display = 'block';
  document.getElementById('tables2').style.display = 'block';
}

const handleDownload = async () => {
  try {
    const response = await fetch('http://localhost:5000/download');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'metadata.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
};

const Screen2 = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [expandedImageIndex, setExpandedImageIndex] = useState(null);
  const [showImages, setShowImages] = useState(true);
  const [loading, setLoading] = useState(true);
  const [feedbackStatus, setFeedbackStatus] = useState({});
  const [showContainedList, setShowContainedList] = useState(false);
  // const [persona, setPersona] = useState('');
  const [ShowVisuals, setShowVisuals] = useState(true);
  const [isBotThinking, setIsBotThinking] = useState(false);



  const chatContainerRef = useRef(null);

  // useEffect(() => {
  //   const fetchPersona = async () => {
  //     try {
  //       const response = await axios.get('http://localhost:5000/get-persona');
  //       setPersona(response.data.persona);
  //     } catch (error) {
  //       console.error('Error fetching persona:', error);
  //     }
  //   };

  //   fetchPersona();
  // }, []);

  const toggleShowVisuals = () => {
    setShowVisuals(!ShowVisuals);
  };

  const sendMessage = async () => {
    if (!userInput.trim()) {
      return;
    }
    const newMessage = { role: 'user', content: userInput, time: getTime() };
    setMessages([...messages, newMessage]);
    setShowImages(false);
    setIsBotThinking(true);
    try {
      if (userInput.trim().length <= 15) {
        const botResponse = { role: 'system', content: "Please elaborate a little bit more. The above question is very short and non descript", time: getTime() };
        setMessages(prevMessages => [...prevMessages, botResponse]);  
      } 
      else {
        const response = await axios.post('http://localhost:5000/echo', { message: userInput });
        const responseData = response.data.message;
        const botResponse = { role: 'system', content: responseData, time: getTime() };
        setMessages(prevMessages => [...prevMessages, botResponse]);
        const tables_used = await axios.get('http://localhost:5000/get-source')
        const botInfoMessage = { role: 'system', content: <><span id='tables0' style={{ whiteSpace: 'pre-wrap', display: 'block' }} onClick={showSource}>Click here to view the source of our answer.</span><span id='tables1' style={{ whiteSpace: 'pre-wrap', display: 'none' }}>{tables_used.data.message}</span><br/><span id='tables2' style={{'text-decoration': 'underline', 'cursor': 'pointer', display: 'none'}} onClick={handleDownload}>Click here to download sources and metadata.</span></>, time: getTime() };
        setMessages(prevMessages => [...prevMessages, botInfoMessage]);
        if (ShowVisuals) {
          const htmlResponse = await axios.get('http://localhost:5000/generated-html');
          if (htmlResponse.status === 200) {
              const htmlContent = htmlResponse.data;
              const botImage = { role: 'system', content: (<iframe className='resp_html' srcDoc={htmlContent} />), time: getTime() };
              setMessages(prevMessages => [...prevMessages, botImage]);
          }
        }
      }
      setFeedbackStatus(prevStatus => ({
        ...prevStatus,
        [messages.length]: { thumbsUp: false, thumbsDown: false }
      }));
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsBotThinking(false);
    }
  };

  const handleItemClick = (text) => {
    setUserInput(text);
    setShowContainedList(false);
  };

  const toggleImageExpand = (index) => {
    if (expandedImageIndex === index) {
      setExpandedImageIndex(null);
    } else {
      setExpandedImageIndex(index);
    }
  };

  useEffect(() => {
    const sendInitialGreeting = async () => {
      try {
        const response = await axios.post('http://localhost:5000/echo', { message: '' });
        const responseData = response.data.message;
        const botResponse = { role: 'system', content: responseData, time: getTime() };
        setMessages([botResponse]);
        setFeedbackStatus({ 0: { thumbsUp: false, thumbsDown: false } });
      } catch (error) {
        console.error('Error sending initial greeting:', error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 5000);
      }
    };

    sendInitialGreeting();
  }, []);


  const handleFeedback = (event, index, type) => {
    setFeedbackStatus(prevStatus => ({
      ...prevStatus,
      [index]: {
        ...prevStatus[index],
        [type]: true
      }
    }));
  };

  if (loading) {
    return (
      <div className="Loading">
        <div aria-atomic="true" aria-live="assertive" className="cds--loading">
          <svg className="cds--loading__svg" viewBox="0 0 200 200">
            <title>loading</title>
            <circle className="cds--loading__stroke" cx="50%" cy="50%" r="44"></circle>
          </svg>
        </div>
        <h6>Personalising your experience!</h6>
      </div>
    );
  }

  return (
    <div className={`screen2 ${expandedImageIndex !== null ? 'expanded-image' : ''}`}>
      <div className="left-side-text">
        <h3 style={{ marginTop: '40px', marginBottom: '7px' }}>Talk to your data</h3>
          <h5>Your current persona is <br />{}<br /><br /><br /></h5>
        <Link to="/">
          <Button kind="tertiary">
            Return Home
          </Button>
        </Link>
      </div>
      <div className="rectangle">
        <div className="chat-container" ref={chatContainerRef}>
          <div className="chat-messages">
            {messages.map((message, index) => (
              <div key={index} className={message.role === 'system' ? 'bot' : 'user'}>
                {message.role === 'system' ? <><img src="/watsonx.svg" className='watson-icon' />&nbsp;<span className="message-time">{message.time}</span></> : <><span className="message-time">{"You\u00A0\u00A0\u00A0" + message.time}</span></>}
                <div className="message-content">
                  {typeof message.content === 'string' ?
                    message.content.split('\n').map((line, idx) => (
                      <div key={idx}>{line}</div>
                    )) : message.content
                  }
                </div>
                {index > 5 && message.role === 'system' && (
                  <div className="reaction-icons">
                    {!feedbackStatus[index] || (!feedbackStatus[index].thumbsUp && !feedbackStatus[index].thumbsDown) ? (
                      <>
                        <ThumbsUp
                          className="reaction-icon-good"
                          onClick={(e) => handleFeedback(e, index, 'thumbsUp')}
                        />
                        <ThumbsDown
                          className="reaction-icon-bad"
                          onClick={(e) => handleFeedback(e, index, 'thumbsDown')}
                        />
                      </>
                    ) : (
                      <div className="feedback-message">Thanks for the feedback!</div>
                    )}
                  </div>
                )}
                <div className="thumbnails">
                  {showImages  && index === 0 && [
                  ].map((src, idx) => (
                    <div key={idx} className="image-container">
                      <iframe
                        className="thumbnail"
                        src={src}
                        alt={`Thumbnail ${idx + 1}`}
                        onClick={() => toggleImageExpand(idx)}
                      />
                      <div style={{ whiteSpace: 'pre-wrap'}} className="label">{}</div>
                    </div>
                  ))}
                </div>
                <div className="thumbnails">
                  {showImages  && index === 0 && [
                  ].map((src, idx) => (
                    <div key={idx} className="image-container">
                      <iframe
                        className="thumbnail"
                        src={src}
                        alt={`Thumbnail ${idx + 1}`}
                        onClick={() => toggleImageExpand(idx)}
                      />
                      <div style={{ whiteSpace: 'pre-wrap'}} className="label">{}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {isBotThinking && (
              <SkeletonText paragraph width='50%'/>
            )}
          </div>
        </div>
        <div className='combined'>
          {showContainedList  && (
            <ContainedList label="Some questions you might have on your mind:" className='cont-list' kind="on-page">
            <ContainedListItem className="cont-list-1" onClick={() => handleItemClick('How many unique accounts have reported issues at each pump station?')}>How many unique accounts have reported issues at each pump station?</ContainedListItem>
            <ContainedListItem className="cont-list-2" onClick={() => handleItemClick('What are the different types of maintenance operations (MOType) recorded in each zone?')}>What are the different types of maintenance operations (MOType) recorded in each zone?</ContainedListItem>
            <ContainedListItem className="cont-list-3" onClick={() => handleItemClick('Across all pump stations, what is the distribution of control statuses (e.g., ON, OFF)?')}> Across all pump stations, what is the distribution of control statuses (e.g., ON, OFF)?</ContainedListItem>
          </ContainedList>
        )}
          <div className="content">
            <div className="input-container">
              <TextArea
                id="text-area"
                rows={1}
                labelText=""
                onClick={() => setShowContainedList(true)}
                onChange={(e) => setUserInput(e.target.value)}
                value={userInput}
                placeholder="Talk to your data"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                    setUserInput('');
                    setShowContainedList(false);
                  }
                  else {
                    setShowContainedList(false);
                  }
                }}
              />
              <Send id='send' onClick={() => { sendMessage(); setUserInput(''); }} />
            </div>
          </div>
        </div>
      </div>
      <footer onClick={toggleShowVisuals}>
        <p className="text-sm">IBM Client Engineering</p>
      </footer>
    </div>
  );
};

export default Screen2;
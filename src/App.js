import React, { useState, useRef } from 'react';
import './App.css';
import { jsPDF } from 'jspdf';

function App() {
  const [name, setName] = useState('');
  const [partnerName, setPartnerName] = useState('');
  const [marriageDate, setMarriageDate] = useState('');
  const [showQuestion, setShowQuestion] = useState(false);
  const [showSecondQuestion, setShowSecondQuestion] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [showAgreement, setShowAgreement] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ top: '50%', left: '50%' });
  const [firstQuestionImage, setFirstQuestionImage] = useState('qstn.png');
  const [secondQuestionImage, setSecondQuestionImage] = useState('crying.png');
  const noAudioRef = useRef(null);
  const yesAudioRef = useRef(null);

  
  function isMobileDevice() {
    return (typeof window.orientation !== "undefined") 
      || (navigator.userAgent.indexOf('IEMobile') !== -1)
      || (window.innerWidth <= 768);
  }

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setShowQuestion(true);
  };

  const handleNoClick = () => {
    
    if (isMobileDevice()) {
      if (noAudioRef.current) {
        noAudioRef.current.play();
      }
      setFirstQuestionImage('crying.png');
      setSecondQuestionImage('crying.png');
      
      
      setNoButtonPosition({
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
      });
    }
    
    if (!showSecondQuestion) {
      setShowSecondQuestion(true);
    }
  };

  const handleNoButtonHover = () => {
    console.log('Hover detected! Changing to crying image');
    
    if (noAudioRef.current) {
      noAudioRef.current.play();
    }

    
    setFirstQuestionImage('crying.png');
    setSecondQuestionImage('crying.png'); 
    
    
    setNoButtonPosition({
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
    });
  };

  const handleYesClick = () => {
    if (noAudioRef.current) {
      noAudioRef.current.pause();
      noAudioRef.current.currentTime = 0;
    }
    if (yesAudioRef.current) {
      yesAudioRef.current.play();
    }
    setShowFinalMessage(true);
    setTimeout(() => {
      setShowAgreement(true);
    }, 5000); 
  };

const handleAgreementSubmit = (e) => {
  e.preventDefault();

  const doc = new jsPDF();

  
  doc.setFontSize(16);
  doc.text("Marriage Agreement", 10, 10);

  
  doc.setFontSize(12);
  doc.text(`This is to certify that ${name} and ${partnerName}`, 10, 20);
  doc.text(`have agreed to marry on ${marriageDate}.`, 10, 28);

  
  doc.text(`Lovely words:`, 10, 40);
  doc.text(`"Together forever, never apart.`, 10, 48);
  doc.text(`Maybe in distance, but never in heart."`, 10, 56);

  
  doc.text("Signed,", 10, 70);
  doc.text(`${name} & ${partnerName}`, 10, 78);

  
  doc.save("marriage_agreement.pdf");
};


  return (
    <div className="App">
      <audio ref={noAudioRef} src={`${process.env.PUBLIC_URL}/cbbcry.mp3`} />
      <audio ref={yesAudioRef} src={`${process.env.PUBLIC_URL}/perfect.mp3`} />

      {!showQuestion && (
        <form onSubmit={handleNameSubmit} className="name-form">
          <label>
            💖 Please enter your beautiful name, my love: 💖
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      )}

      {showQuestion && !showSecondQuestion && !showFinalMessage && (
        <div className="question-container">
          <p>Do you love me?</p>
          <img src={`${process.env.PUBLIC_URL}/${firstQuestionImage}`} alt="" className="photo" />
          <button onClick={handleYesClick}>Yes</button>
          <button
            onClick={handleNoClick}
            onMouseEnter={isMobileDevice() ? null : handleNoButtonHover}
            onTouchStart={isMobileDevice() ? handleNoButtonHover : null}
            style={{ position: 'absolute', top: noButtonPosition.top, left: noButtonPosition.left }}
          >
            No
          </button>
        </div>
      )}

      {showSecondQuestion && !showFinalMessage && (
        <div className="question-container">
          <p>Are you sure you don't love me, {name}? 😢</p>
          <img src={`${process.env.PUBLIC_URL}/${secondQuestionImage}`} alt="" className="photo" />
          <button onClick={handleYesClick}>Yes</button>
          <button
            onClick={handleNoClick}
            onMouseEnter={handleNoButtonHover}
            style={{ position: 'absolute', top: noButtonPosition.top, left: noButtonPosition.left }}
          >
            No
          </button>
        </div>
      )}

      {showFinalMessage && (
        <div className="final-message">
          <p>I know you love me and I love you too, Golu Molu!!! {name}</p>
          <img src={`${process.env.PUBLIC_URL}/tooo.png`} alt="" className="photo" />
        </div>
      )}

      {showAgreement && (
        <form onSubmit={handleAgreementSubmit} className="agreement-form">
          <label>
            Partner's Name:
            <input
              type="text"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
              required
            />
          </label>
          <label>
            Marriage Date:
            <input
              type="date"
              value={marriageDate}
              onChange={(e) => setMarriageDate(e.target.value)}
              required
            />
          </label>
          <button type="submit">Download Agreement</button>
        </form>
      )}
    </div>
  );
}

export default App;
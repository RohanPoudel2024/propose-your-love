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
  const noAudioRef = useRef(null);
  const yesAudioRef = useRef(null);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    setShowQuestion(true);
  };

  const handleNoClick = () => {
    if (noAudioRef.current) {
      noAudioRef.current.play();
    }
    if (!showSecondQuestion) {
      setShowSecondQuestion(true);
    } else {
      setNoButtonPosition({
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`,
      });
    }
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
    }, 5000); // Show agreement after 5 seconds
  };

  const handleAgreementSubmit = (e) => {
    e.preventDefault();
    const doc = new jsPDF();
    doc.text(`Marriage Agreement`, 10, 10);
    doc.text(`This is to certify that ${name} and ${partnerName} have agreed to marry on ${marriageDate}.`, 10, 20);
    doc.text(`Lovely words: "Together forever, never apart. Maybe in distance, \n but never in heart."`, 10, 30);
    doc.text(`\nSigned,`, 10, 40);
    doc.text(`${name} & ${partnerName}`, 10, 50);
    doc.save('marriage_agreement.pdf');
  };

  return (
    <div className="App">
      <audio ref={noAudioRef} src="/propose-your-love/public/cbbcry.mp3" />
      <audio ref={yesAudioRef} src="/propose-your-love/public/perfect.mp3" />

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
          <img src="/propose-your-love/public/qstn.png" alt="" className="photo" />
          <button onClick={handleYesClick}>Yes</button>
          <button
            onClick={handleNoClick}
            style={{ position: 'absolute', top: noButtonPosition.top, left: noButtonPosition.left }}
          >
            No
          </button>
        </div>
      )}

      {showSecondQuestion && !showFinalMessage && (
        <div className="question-container">
          <p>Are you sure you don't love me, {name}? 😢</p>
          <img src="propose-your-love/public/crying.png" alt="" className="photo" />
          <button onClick={handleYesClick}>Yes</button>
          <button
            onClick={handleNoClick}
            style={{ position: 'absolute', top: noButtonPosition.top, left: noButtonPosition.left }}
          >
            No
          </button>
        </div>
      )}

      {showFinalMessage && (
        <div className="final-message">
          <p>I know you love me and I love you too, Golu Molu!!! {name}</p>
          <img src="/propose-your-love/public/tooo.png" alt="photo" className="photo" />
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
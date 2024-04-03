import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [text2, setText2] = useState('');
  const [labels, setLabels] = useState('');
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false); 
  const [currentAction, setCurrentAction] = useState(null); 

  const baseURL = 'https://4abd-34-86-181-216.ngrok-free.app';

  const handleSentiment = async () => {
    try {
      setLoading(true); 
      setCurrentAction('sentiment'); 
      setResult(null); 
      const response = await axios.post(`${baseURL}/api/sentiment`, { text });
      setResult(response.data);
      scrollToResults(); 
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setLoading(false); 
    }
  };
  
  const handleZeroShot = async () => {
    try {
      setLoading(true); 
      setCurrentAction('zeroShot'); 
      setResult(null); 
      const response = await axios.post(`${baseURL}/api/zero_shot`, { text: text2, labels: labels.split(',') });
      setResult(response.data);
      scrollToResults();
    } catch (error) {
      console.error('Error classifying:', error);
    } finally {
      setLoading(false); 
    }
  };
  
  const handleTextGeneration = async () => {
    try {
      setLoading(true); 
      setCurrentAction('textGeneration'); 
      setResult(null); 
      const response = await axios.post(`${baseURL}/api/text_generation`, { prompt });
      setResult(response.data);
      scrollToResults(); 
    } catch (error) {
      console.error('Error generating text:', error);
    } finally {
      setLoading(false); 
    }
  };
  
  const scrollToResults = () => {
    const resultsDiv = document.getElementById('results');
    if (resultsDiv) {
      resultsDiv.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleKeyPress = (event, actionFunction) => {
    if (event.key === 'Enter') {
      actionFunction();
    }
  };

  const renderResult = () => {
    if (!loading && result) {
      switch (currentAction) {
        case 'sentiment':
          return renderSentimentResult();
        case 'zeroShot':
          return renderZeroShotResult();
        case 'textGeneration':
          return renderTextGenerationResult();
        default:
          return null;
      }
    }
    return null;
  };

  const renderSentimentResult = () => {
    if (result && result.length > 0) {
      const sentiment = result[0];
      return (
        <div className="result">
          <h2>Sentiment Analysis Result</h2>
          <p><strong>Label:</strong> {sentiment.label}</p>
          <p><strong>Score:</strong> {sentiment.score}</p>
        </div>
      );
    }
    return null;
  };

  const renderZeroShotResult = () => {
    if (result && result.labels && result.scores) {
      return (
        <div className="result">
          <h2>Zero-shot Classification Result</h2>
          <p><strong>Sequence:</strong> {result.sequence}</p>
          <p><strong>Labels:</strong> {result.labels.join(', ')}</p>
          <p><strong>Scores:</strong> {result.scores.join(', ')}</p>
        </div>
      );
    }
    return null;
  };

  const renderTextGenerationResult = () => {
    if (result && result.length > 0) {
      return (
        <div className="result">
          <h2>Text Generation Result</h2>
          {result.map((item, index) => (
            <p key={index}><strong>Generated Text {index + 1}:</strong> {item.generated_text}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="App">
      <h1>Transformer Playground</h1>


      <div>
        <h2>Sentiment Analysis</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, handleSentiment)}
          placeholder="Enter text for sentiment analysis"
        ></textarea>
        <br />
        <button onClick={handleSentiment}>Analyze Sentiment</button>
      </div>

      <div>
        <h2>Zero-shot Classification</h2>
        <textarea
          value={text2}
          onChange={(e) => setText2(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, handleZeroShot)}
          placeholder="Enter text for zero-shot classification"
        ></textarea>
        <br />
        <input
          type="text"
          value={labels}
          onChange={(e) => setLabels(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, handleZeroShot)}
          placeholder="Enter labels (comma-separated)"
        />
        <br />
        <button onClick={handleZeroShot}>Classify</button>
      </div>

      <div>
        <h2>Text Generation</h2>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyPress={(e) => handleKeyPress(e, handleTextGeneration)}
          placeholder="Enter prompt for text generation"
        />
        <br />
        <button onClick={handleTextGeneration}>Generate Text</button>
      </div>

      {loading && <div className="loader"></div>}

      <div id="results">
        {renderResult()}
      </div>

    </div>
  );
}

export default App;

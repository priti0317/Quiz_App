import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './App.css';


const Quiz = () => {
  const [mode, setMode] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timer, setTimer] = useState(15);
  const [showScore, setShowScore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  

  useEffect(() => {
    if (timer > 0 && mode && !showScore) {
      const timerId = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(timerId);
    } else if (timer === 0) {
      handleNextQuestion();
    }
  }, [timer, mode, showScore]);

  useEffect(() => {
    if (mode) {
      fetchQuestions(mode);
    }
  }, [mode]);

  const fetchQuestions = async (selectedMode) => {
    setLoading(true);
    setError(false);
    try {
      const response = await fetch(`https://opentdb.com/api.php?amount=10&difficulty=${selectedMode}&type=multiple`);
      const data = await response.json();
      const formattedQuestions = data.results.map((item) => ({
        question: item.question,
        options: shuffleArray([...item.incorrect_answers, item.correct_answer]),
        answer: item.correct_answer,
      }));
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

  const handleModeSelect = (selectedMode) => {
    setMode(selectedMode);
    setTimer(15);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    if (option === questions[currentQuestion]?.answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setTimer(15);
    } else {
      setShowScore(true);
    }
  };

  const handleRetry = () => {
    setMode(null);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedOption(null);
    setTimer(15);
    setShowScore(false);
  };

  const ProgressBar = () => (
    <div className="progress-bar">
      <motion.div
        className="progress"
        initial={{ width: 0 }}
        animate={{ width: '${((currentQuestion + 1) / questions.length) * 100}% '}}
        transition={{ duration: 0.5 }}
      />
    </div>
  );

  const LoadingScreen = () => (
    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="loading-section">
      <h2>Loading Questions...</h2>
    </motion.div>
  );

  const ErrorScreen = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-section">
      <h2>Failed to Load Questions</h2>
      <p>Something went wrong. Please try again.</p>
      <button onClick={handleRetry} className="retry-button">
        Retry
      </button>
    </motion.div>
  );

  return (
    <div className="app-container">
      
      {mode === null ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mode-selection"
        ><div class="human">
    <div class="head">
      <div class="eye left"></div>
      <div class="eye right"></div>
    </div>
    <div class="body">
      <div class="arm left"></div>
      <div class="arm right"></div>
    </div>
    <div class="leg left"></div>
    <div class="leg right"></div>
  </div>
          <h1 className="title"> Quiz</h1>
          <p>Select a difficulty level:</p>
          <div className="mode-buttons">
            <button onClick={() => handleModeSelect("easy")}>Easy</button>
            <button onClick={() => handleModeSelect("medium")}>Medium</button>
            <button onClick={() => handleModeSelect("hard")}>Hard</button>
          </div>
        </motion.div>
      ) : loading ? (
        <LoadingScreen />
      ) : error ? (
        <ErrorScreen />
      ) : showScore ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="score-section"
        >
          <h2>Congratulations!</h2>
          <p>Your Score: {score}/{questions.length}</p>
          <motion.div
            className="retry-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <button onClick={handleRetry}>Retry</button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ x: -200 }}
          animate={{ x: 0 }}
          className="quiz-section"
        >
          <ProgressBar />
          <div className="question">
            <h3 dangerouslySetInnerHTML={{ __html: questions[currentQuestion]?.question }}></h3>
            <div className="options">
              {questions[currentQuestion]?.options.map((option, index) => (
                <motion.button
                  key={index}
                  className={`option-button ${
                    selectedOption === option ? "selected" : ""
                  }`}
                  onClick={() => handleOptionSelect(option)}
                  whileHover={{ scale: 1.05 }}
                >
                  {option}
                </motion.button>
              ))}
            </div>
          </div>
          <div className="footer">
            <p>Time Left: {timer}s</p>
            <button
              onClick={handleNextQuestion}
              disabled={selectedOption === null}
            >
              Next
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Quiz;
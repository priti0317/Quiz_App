import React, { useState } from "react";
import { motion } from "framer-motion";
import Quiz from "./Quiz";
import logo from './logo.svg';
import './App.css';

const AnimatedLandingPage = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  const handleStartClick = () => {
    setShowQuiz(true);
  };

  if (showQuiz) {
    return <Quiz />;
  }

  return (
    
    <div className="min-h-screen bg-gradient-to-r from-green-400 to-blue-500 flex flex-col items-center justify-center text-white">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="mt-10 w-3/4 md:w-1/2 lg:w-1/3"
      >
        <div className="logo1">
        <img src={logo} alt="Description" width="300" />

        </div>
      

      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center welcome "
      >
        <h1 className="text-5xl font-extrabold mb-6 drop-shadow-lg">
          Welcome to the Quiz App!
        </h1>
        <p className="text-lg mb-6 max-w-xl leading-relaxed">
          Challenge yourself and test your knowledge with our exciting quizzes.
          Select a level and dive right in!
        </p>
        <p className="text-lg mb-6 max-w-xl leading-relaxed">
        Select a level and dive right in!
        </p>
        <motion.button
          onClick={handleStartClick}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="bg-white text-green-500 font-semibold py-3 px-8 rounded-lg shadow-2xl hover:bg-gray-100 hover:shadow-lg transition duration-300 button-85" role="button"
        >
          Start Quiz
        </motion.button>
      </motion.div>
      
    </div>
  );
};

export default AnimatedLandingPage;
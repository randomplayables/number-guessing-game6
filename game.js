import React, { useState, useEffect } from 'react';

const styles = `
.game-container {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f3f4f6;
  border-radius: 8px;
  max-width: 400px;
  margin: 40px auto;
}
.title {
  color: #2563eb;
  margin-bottom: 10px;
}
.feedback {
  margin: 10px 0;
  font-size: 18px;
  color: #1f2937;
}
.input {
  width: 100px;
  padding: 8px;
  font-size: 16px;
  margin-right: 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}
.button {
  background-color: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
}
.button:hover {
  background-color: #059669;
}
`;

const App: React.FC = () => {
  const [target, setTarget] = useState<number>(0);
  const [guess, setGuess] = useState<string>("");
  const [feedback, setFeedback] = useState<string>("Guess a number between 1 and 100");
  const [attempts, setAttempts] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);

  useEffect(() => {
    initGame();
  }, []);

  const initGame = (): void => {
    const randomNum = Math.floor(Math.random() * 100) + 1;
    setTarget(randomNum);
    setGuess("");
    setFeedback("Guess a number between 1 and 100");
    setAttempts(0);
    setIsWon(false);
    if (typeof window.sendDataToGameLab === "function") {
      window.sendDataToGameLab({
        event: "game_started",
        timestamp: new Date().toISOString()
      });
    }
  };

  const handleGuessChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setGuess(e.target.value);
  };

  const handleGuessSubmit = (): void => {
    const numGuess = parseInt(guess, 10);
    if (isNaN(numGuess)) {
      setFeedback("Please enter a valid number");
      return;
    }
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let newFeedback = "";
    if (numGuess < target) {
      newFeedback = "Too low!";
    } else if (numGuess > target) {
      newFeedback = "Too high!";
    } else {
      newFeedback = `Correct! You guessed it in ${newAttempts} attempts.`;
      setIsWon(true);
    }
    setFeedback(newFeedback);

    if (typeof window.sendDataToGameLab === "function") {
      window.sendDataToGameLab({
        event: "guess_made",
        guess: numGuess,
        feedback: newFeedback,
        attempts: newAttempts,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="game-container">
        <h1 className="title">Number Guessing Game</h1>
        <p className="feedback">{feedback}</p>
        {!isWon && (
          <div>
            <input
              type="number"
              value={guess}
              onChange={handleGuessChange}
              className="input"
            />
            <button onClick={handleGuessSubmit} className="button">
              Guess
            </button>
          </div>
        )}
        {isWon && (
          <button onClick={initGame} className="button">
            Play Again
          </button>
        )}
      </div>
    </>
  );
};

export default App;
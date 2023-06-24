import logo from "./logo.svg";
import "./App.css";
import styled from "styled-components";
import { useState, useEffect } from "react";
const BIRD_SIZE = 20;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 100;
const OBSTACLE_WIDTH = 40;
const OBSTACLE_GAP = 250;

function App() {
  const [birdPostion, setBirdPostion] = useState(250);
  const [gameStarted, setGameStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(100);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;
  const [score, setScore] = useState(-2);

  useEffect(() => {
    let timeId;
    if (gameStarted && birdPostion < GAME_HEIGHT - BIRD_SIZE) {
      timeId = setInterval(() => {
        setBirdPostion((birdPostion) => birdPostion + GRAVITY);
      }, 24);
    }
    return () => {
      clearInterval(timeId);
    };
  }, [birdPostion, gameStarted]);

  useEffect(
    (el) => {
      let obstacleId;
      if (gameStarted && obstacleLeft >= 0) {
        obstacleId = setInterval(() => {
          setObstacleLeft((obstacleLeft) => obstacleLeft - 5);
        }, 24);

        return () => {
          clearInterval(obstacleId);
        };
      } else {
        setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
        setObstacleHeight(
          Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP))
        );
        setScore((score) => score + 1);
      }
    },
    [gameStarted, obstacleLeft]
  );

  useEffect(() => {
    const hasCollidedWithTopObstacle =
      birdPostion >= 0 && birdPostion < obstacleHeight;
    const hasCollidedWithBottomObstacle =
      birdPostion <= 500 && birdPostion >= 500 - bottomObstacleHeight;

    if (
      obstacleLeft >= 0 &&
      obstacleLeft <= OBSTACLE_WIDTH &&
      (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle)
    ) {
      setGameStarted(false);
      setScore(-2);
    }
  }, [birdPostion, obstacleHeight, bottomObstacleHeight, obstacleLeft]);

  const handleClick = () => {
    let newBirdPostion = birdPostion - JUMP_HEIGHT;
    if (!gameStarted) {
      setGameStarted(true);
    } else if (newBirdPostion < 0) {
      setBirdPostion(0);
    } else {
      setBirdPostion(newBirdPostion);
    }
  };
  return (
    <div
      onClick={handleClick}
      style={{
        display: "flex",
        width: "100%",
        justifyContent: "center",
      }}
    >
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        <Obstacle
          top={0}
          width={OBSTACLE_WIDTH}
          height={obstacleHeight}
          left={obstacleLeft}
        />
        <Obstacle
          top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
          width={OBSTACLE_WIDTH}
          height={bottomObstacleHeight}
          left={obstacleLeft}
        />
        <Bird size={BIRD_SIZE} top={birdPostion} />
      </GameBox>
      <spna
        style={{
          color: "white",
          fontSize: "50px",
          position: "absolute",
          top: "0",
        }}
      >
        {score}
      </spna>
    </div>
  );
}

export default App;

const Bird = styled.div`
  position: absolute;

  background-color: red;
  height: ${(probs) => probs.size}px;
  width: ${(probs) => probs.size}px;
  top: ${(probs) => probs.top}px;
  border-radius: 50%;
`;

const GameBox = styled.div`
  height: ${(probs) => probs.height}px;
  width: ${(probs) => probs.width}px;
  background-color: blue;
  overflow: hidden;
`;

const Obstacle = styled.div`
  position: relative;
  top: ${(probs) => probs.top}px;
  width: ${(probs) => probs.width}px;
  height: ${(probs) => probs.height}px;
  left: ${(probs) => probs.left}px;
  background-color: green;
`;

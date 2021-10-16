import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import createMovesChannel from "channels/movesChannel";

const Square = ({ value, i, j, onClick }) => (
  <Button
    variant="outline-dark"
    className="h-100 w-100 p-0"
    style={{ borderRadius: 0, lineHeight: 0 }}
    onClick={() => onClick(i, j)}
    disabled={!!value}
  >
    {value}
  </Button>
);

const copyArray = (arr) => JSON.parse(JSON.stringify(arr));

const currentPiece = (board) => {
  let osCount = 0;
  let xsCount = 0;
  board.forEach((row) =>
    row.forEach((column) => {
      if (column === "O") {
        osCount++;
      }
      if (column === "X") {
        xsCount++;
      }
    })
  );
  return osCount > xsCount ? "X" : "O";
};

const getWinner = (board) => {
  const masks = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];
  for (let i = 0; i < masks.length; i++) {
    const [a, b, c] = masks[i];
    if (
      board[a[0]][a[1]] &&
      board[a[0]][a[1]] === board[b[0]][b[1]] &&
      board[a[0]][a[1]] === board[c[0]][c[1]]
    ) {
      return board[a[0]][a[1]];
    }
  }
  return null;
};

const Board = ({
  gameId,
  columnsCount,
  rowsCount,
  height = 200,
  width = 200,
}) => {
  const [gameState, setGameState] = useState({
    board: Array(rowsCount).fill(Array(columnsCount).fill(null)),
    isNext: true,
    winner: null,
  });

  useEffect(async () => {
    const response = await fetch(`/api/v1/games/${gameId}`);
    const fetchedGame = await response.json();
    let initialBoard = copyArray(gameState.board);

    const board = fetchedGame.moves.forEach((move) => {
      const [i, j] = move.position.split(",");
      initialBoard[i][j] = move.piece;
    });
    setGameState({
      board: initialBoard,
      winner: getWinner(initialBoard),
      isNext: gameState.isNext,
    });

    createMovesChannel(gameId).received = ({ move }) => {
      const [i, j] = move.position.split(",");

      setGameState((previousState) => {
        let newBoard = copyArray(previousState.board);
        newBoard[i][j] = move.piece;
        return {
          board: newBoard,
          winner: getWinner(newBoard),
          isNext: true,
        };
      });
    };
  }, []);

  const onClick = async (i, j) => {
    await fetch("/api/v1/moves", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector("[name=csrf-token]").content,
      },
      body: JSON.stringify({
        position: `${i},${j}`,
        piece: currentPiece(gameState.board),
        game_id: gameId,
      }),
    });
    setGameState((previousState) => ({ ...previousState, isNext: false }));
  };

  return (
    <>
      <div
        className="d-flex flex-column mx-auto"
        style={{
          height,
          width,
          pointerEvents: `${
            !!gameState.winner || !gameState.isNext ? "none" : "auto"
          }`,
        }}
      >
        {Array(rowsCount)
          .fill()
          .map((_, i) => {
            return (
              <Row className="m-0" style={{ flexGrow: 1, flexWrap: "nowrap" }}>
                {Array(columnsCount)
                  .fill()
                  .map((_, j) => {
                    return (
                      <Col className="p-0">
                        <Square
                          value={gameState.board[i][j]}
                          i={i}
                          j={j}
                          onClick={onClick}
                        />
                      </Col>
                    );
                  })}
              </Row>
            );
          })}
      </div>
      {gameState.winner ? (
        <div className="text-center text-success">{gameState.winner} won!</div>
      ) : (
        <></>
      )}
    </>
  );
};

export default Board;

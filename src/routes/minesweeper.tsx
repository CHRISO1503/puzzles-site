import { useEffect, useState, useRef } from "react";
import "../styles/minesweeper.css";

export default function Minesweeper() {
    const GRID_WIDTH = 20;
    const GRID_HEIGHT = 15;
    const MINE_CHANCE = 0.1;
    const CELL_SIZE = 32;
    const TILE_ARRAY = [
        "TileEmpty",
        "Tile1",
        "Tile2",
        "Tile3",
        "Tile4",
        "Tile5",
        "Tile6",
        "Tile7",
        "Tile8",
        "TileMine",
        "TileExploded",
        "TileUnknown",
        "TileFlag",
    ];
    const ADJACENCIES = [
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1],
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
    ];
    const [grid, setGrid] = useState([] as number[][]);
    const [mines, setMines] = useState([] as boolean[][]);
    const [tileNumbers, setTileNumbers] = useState([] as number[][]);
    const [completionText, setCompletionText] = useState("");
    const puzzleFinished = useRef(false);

    useEffect(() => {
        initializeMines();
    }, []);

    useEffect(() => {
        if (mines.length > 0) {
            initializeGrid();
        }
    }, [mines]);

    const initializeMines = () => {
        let mines = [] as boolean[][];
        for (let i = 0; i < GRID_HEIGHT; i++) {
            mines.push([]);
            for (let j = 0; j < GRID_WIDTH; j++) {
                if (Math.random() < MINE_CHANCE) {
                    mines[i].push(true);
                } else {
                    mines[i].push(false);
                }
            }
        }
        setMines(mines.slice());
        puzzleFinished.current = false;
        setCompletionText("");
    };

    const initializeGrid = () => {
        let grid = [] as number[][];
        let tileNumbers = [] as number[][];
        let tileNumber = 0;
        for (let i = 0; i < GRID_HEIGHT; i++) {
            grid.push([]);
            tileNumbers.push([]);
            for (let j = 0; j < GRID_WIDTH; j++) {
                grid[i].push(11);
                tileNumber = 0;
                for (const adj of ADJACENCIES) {
                    const tileCheckPos = [i + adj[0], j + adj[1]];
                    if (
                        tileCheckPos[0] < 0 ||
                        tileCheckPos[0] >= GRID_HEIGHT ||
                        tileCheckPos[1] < 0 ||
                        tileCheckPos[1] >= GRID_WIDTH
                    ) {
                        continue;
                    } else if (mines[tileCheckPos[0]][tileCheckPos[1]]) {
                        tileNumber++;
                    }
                }
                tileNumbers[i].push(tileNumber);
            }
        }
        setTileNumbers(tileNumbers.slice());
        setGrid(grid.slice());
    };

    function handleRightClick(i: number, j: number) {
        if (puzzleFinished.current == true) {
            return;
        }
        if (grid[i][j] == 12) {
            return;
        } else if (mines[i][j]) {
            showMines(i, j);
        } else if (tileNumbers[i][j] == 0) {
            uncoverTile(i, j);
        } else {
            uncoverTile(i, j);
            grid[i][j] = tileNumbers[i][j];
            setGrid(grid.map((row) => row.slice()));
        }
        checkForWin();
    }

    function handleLeftClick(i: number, j: number) {
        if (puzzleFinished.current) {
            return;
        }
        if (grid[i][j] == 11) {
            grid[i][j] = 12;
        } else if (grid[i][j] == 12) {
            grid[i][j] = 11;
        } else if (0 < grid[i][j] && grid[i][j] < 9) {
            chord(i, j);
        }
        setGrid(grid.slice());
        checkForWin();
    }

    function chord(i: number, j: number) {
        let flagNumber = 0;
        for (const adj of ADJACENCIES) {
            const tileCheckPos = [i + adj[0], j + adj[1]];
            if (
                tileCheckPos[0] < 0 ||
                tileCheckPos[0] >= GRID_HEIGHT ||
                tileCheckPos[1] < 0 ||
                tileCheckPos[1] >= GRID_WIDTH
            ) {
                continue;
            } else {
                if (grid[tileCheckPos[0]][tileCheckPos[1]] == 12) {
                    flagNumber++;
                }
            }
        }
        if (grid[i][j] == flagNumber) {
            for (const adj of ADJACENCIES) {
                const tileCheckPos = [i + adj[0], j + adj[1]];
                if (
                    tileCheckPos[0] < 0 ||
                    tileCheckPos[0] >= GRID_HEIGHT ||
                    tileCheckPos[1] < 0 ||
                    tileCheckPos[1] >= GRID_WIDTH
                ) {
                    continue;
                } else {
                    if (grid[tileCheckPos[0]][tileCheckPos[1]] == 11) {
                        if (mines[tileCheckPos[0]][tileCheckPos[1]]) {
                            showMines(tileCheckPos[0], tileCheckPos[1]);
                        } else {
                            uncoverTile(tileCheckPos[0], tileCheckPos[1]);
                        }
                    }
                }
            }
        }
    }

    function uncoverTile(i: number, j: number) {
        if (grid[i][j] == 11) {
            if (tileNumbers[i][j] == 0) {
                grid[i][j] = 0;
                for (const adj of ADJACENCIES) {
                    const tileCheckPos = [i + adj[0], j + adj[1]];
                    if (
                        tileCheckPos[0] < 0 ||
                        tileCheckPos[0] >= GRID_HEIGHT ||
                        tileCheckPos[1] < 0 ||
                        tileCheckPos[1] >= GRID_WIDTH
                    ) {
                        continue;
                    } else {
                        uncoverTile(tileCheckPos[0], tileCheckPos[1]);
                    }
                }
            } else {
                grid[i][j] = tileNumbers[i][j];
            }
            setGrid(grid.map((row) => row.slice()));
        }
    }

    function showMines(iExploded: number, jExploded: number) {
        for (let i = 0; i < GRID_HEIGHT; i++) {
            for (let j = 0; j < GRID_WIDTH; j++) {
                if (mines[i][j]) {
                    grid[i][j] = 9;
                }
            }
        }
        grid[iExploded][jExploded] = 10;
        setGrid(grid.slice());
        puzzleFinished.current = true;
    }

    function checkForWin() {
        for (let i = 0; i < GRID_HEIGHT; i++) {
            for (let j = 0; j < GRID_WIDTH; j++) {
                if (mines[i][j]) {
                    if (grid[i][j] != 12) {
                        return;
                    }
                } else {
                    if (grid[i][j] == 11) {
                        return;
                    }
                }
            }
        }
        puzzleFinished.current = true;
        setCompletionText("Puzzle complete.");
    }

    return (
        <>
            <h1 className="minesweeper" id="title">Minesweeper</h1>
            <div className="minesweeper crt board">
                {grid.map((row, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                            userSelect: "none",
                        }}
                    >
                        {row.map((cell, j) => (
                            <img
                                key={j}
                                src={`src\\assets\\${TILE_ARRAY[cell]}.png`}
                                style={{
                                    width: CELL_SIZE,
                                    height: CELL_SIZE,
                                    userSelect: "none",
                                }}
                                onClick={() => handleLeftClick(i, j)}
                                onContextMenu={(e) => {
                                    handleRightClick(i, j);
                                    e.preventDefault();
                                }}
                                draggable="false"
                            ></img>
                        ))}
                    </div>
                ))}
            </div>
            <button className="minesweeper action-button" onClick={initializeMines}>
                New Game
            </button>
            <p className="minesweeper board-completion">{completionText}</p>
        </>
    );
}

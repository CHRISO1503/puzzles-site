import { useEffect, useState } from "react";
import "../styles/hue.css";

export default function Hue() {
    const SQUARE_WIDTH = 65;
    const NUMBER_OF_ROWS = 10;
    const NUMBER_OF_COLUMNS = 12;
    const [grid, setGrid] = useState([] as number[][][]);
    const [initialGrid, setInitialGrid] = useState([] as number[][][]);
    const [xGradient, setXGradient] = useState([] as number[]);
    const [yGradient, setYGradient] = useState([] as number[]);
    const [originColour, setOriginColour] = useState([] as number[]);
    const DEFAULT_ANCHORS = [
        [0, 0],
        [NUMBER_OF_ROWS - 1, 0],
        [0, NUMBER_OF_COLUMNS - 1],
        [NUMBER_OF_ROWS - 1, NUMBER_OF_COLUMNS - 1],
        [Math.ceil((NUMBER_OF_ROWS - 1) / 2), 0],
        [Math.floor((NUMBER_OF_ROWS - 1) / 2), 0],
        [Math.ceil((NUMBER_OF_ROWS - 1) / 2), NUMBER_OF_COLUMNS - 1],
        [Math.floor((NUMBER_OF_ROWS - 1) / 2), NUMBER_OF_COLUMNS - 1],
        [0, Math.ceil((NUMBER_OF_COLUMNS - 1) / 2)],
        [0, Math.floor((NUMBER_OF_COLUMNS - 1) / 2)],
        [NUMBER_OF_ROWS - 1, Math.ceil((NUMBER_OF_COLUMNS - 1) / 2)],
        [NUMBER_OF_ROWS - 1, Math.floor((NUMBER_OF_COLUMNS - 1) / 2)],
    ];
    const [anchorPoints, setAnchorPoints] = useState(DEFAULT_ANCHORS);
    const [pointSelectedCoords, setPointSelectedCoords] = useState(
        [] as number[]
    );
    const [pointSelected, setPointSelected] = useState(false);
    const [anchoring, setAnchoring] = useState(true);
    const [completionText, setCompletionText] = useState("");

    useEffect(() => {
        initializeColours();
    }, []);

    useEffect(() => {
        setCompletionText("");
        setAnchoring(true);
        initializeGrid();
    }, [yGradient]);

    function initializeColours() {
        setOriginColour([
            Math.random() * 360,
            Math.random() * 10 + 45,
            Math.random() * 10 + 45,
        ]);
        setXGradient([
            Math.random() * 15,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
        ]);
        setYGradient([
            -Math.random() * 15,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
        ]);
    }

    function initializeGrid() {
        let grid = [] as number[][][];
        for (let i = 0; i < NUMBER_OF_ROWS; i++) {
            grid.push([]);
            for (let j = 0; j < NUMBER_OF_COLUMNS; j++) {
                grid[i].push(
                    addArrayMultiple(
                        addArrayMultiple(originColour, xGradient, i),
                        yGradient,
                        j
                    )
                );
            }
        }
        setInitialGrid(grid.map((row) => row.slice()));
        setGrid(grid.slice());
    }

    function shuffleBoard() {
        setAnchoring(false);
        for (let i = 0; i < NUMBER_OF_ROWS; i++) {
            for (let j = 0; j < NUMBER_OF_COLUMNS; j++) {
                if (
                    anchorPoints.findIndex((c) => c[0] === i && c[1] === j) ===
                    -1
                ) {
                    let swapI = Math.floor(Math.random() * NUMBER_OF_ROWS);
                    let swapJ = Math.floor(Math.random() * NUMBER_OF_COLUMNS);
                    while (
                        anchorPoints.findIndex(
                            (c) => c[0] === swapI && c[1] === swapJ
                        ) !== -1
                    ) {
                        swapI = Math.floor(Math.random() * NUMBER_OF_ROWS);
                        swapJ = Math.floor(Math.random() * NUMBER_OF_COLUMNS);
                    }
                    let temp = grid[i][j];
                    grid[i][j] = grid[swapI][swapJ];
                    grid[swapI][swapJ] = temp;
                }
            }
        }
        setGrid(grid.slice());
    }

    function addArrayMultiple(u: number[], v: number[], n: number) {
        return u.map((x, i) => x + n * v[i]);
    }

    function handleClick(i: number, j: number) {
        if (completionText != "") {
            setCompletionText("");
        }
        if (anchoring) {
            if (
                anchorPoints.findIndex((c) => c[0] === i && c[1] === j) !== -1
            ) {
                let newAnchorPoints = [] as number[][];
                for (let index = 0; index < anchorPoints.length; index++) {
                    if (
                        anchorPoints[index][0] == i &&
                        anchorPoints[index][1] == j
                    ) {
                        continue;
                    }
                    newAnchorPoints.push([
                        anchorPoints[index][0],
                        anchorPoints[index][1],
                    ]);
                }
                setAnchorPoints(newAnchorPoints.slice());
            } else {
                anchorPoints.push([i, j]);
                setAnchorPoints(anchorPoints);
                setGrid(grid.slice());
            }
        } else {
            if (
                anchorPoints.findIndex((c) => c[0] === i && c[1] === j) !== -1
            ) {
                return;
            }
            if (pointSelected) {
                let temp = grid[i][j];
                grid[i][j] =
                    grid[pointSelectedCoords[0]][pointSelectedCoords[1]];
                grid[pointSelectedCoords[0]][pointSelectedCoords[1]] = temp;
                setGrid(grid.slice());
                setPointSelected(false);
                checkProgress(false);
            } else {
                setPointSelectedCoords([i, j]);
                setPointSelected(true);
            }
        }
    }

    function resetAnchorPoints() {
        setAnchorPoints(DEFAULT_ANCHORS);
    }

    function checkProgress(manualCheck: boolean) {
        if (completionText != "") {
            setCompletionText("");
            return;
        }
        let correct = 0;
        let gridSize = NUMBER_OF_COLUMNS * NUMBER_OF_ROWS;
        for (let i = 0; i < NUMBER_OF_ROWS; i++) {
            for (let j = 0; j < NUMBER_OF_COLUMNS; j++) {
                if (initialGrid[i][j] == grid[i][j]) {
                    correct++;
                }
            }
            if (correct == gridSize) {
                setCompletionText("Puzzle complete.");
            } else if (manualCheck) {
                setCompletionText(
                    `${gridSize - correct} tiles are incorrectly placed.`
                );
            }
        }
    }

    return (
        <>
            <h1 className="hue" id="title">
                Hue
            </h1>
            <div className="hue crt board">
                {grid.map((row, i) => (
                    <div key={i} style={{ display: "table" }}>
                        {row.map((cell, j) => (
                            <div
                                key={j}
                                onClick={() => handleClick(i, j)}
                                className={`${
                                    pointSelectedCoords[0] == i &&
                                    pointSelectedCoords[1] == j &&
                                    pointSelected
                                        ? "selected-tile"
                                        : "tile"
                                } hue ${
                                    anchorPoints.findIndex(
                                        (c) => c[0] === i && c[1] === j
                                    ) !== -1
                                        ? "anchor-point"
                                        : ""
                                }`}
                                style={{
                                    display: "table-cell",
                                    backgroundColor: `hsl(${cell[0]} ${cell[1]}% ${cell[2]}%)`,
                                    width: SQUARE_WIDTH,
                                    height: SQUARE_WIDTH,
                                }}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
            <div className="hue">
                <button className="hue action-button" onClick={shuffleBoard}>
                    Shuffle
                </button>
                <button
                    className="hue action-button"
                    onClick={initializeColours}
                >
                    New Game
                </button>
                <button
                    className="hue action-button"
                    onClick={resetAnchorPoints}
                >
                    Reset Fixed
                </button>
                <button
                    className="hue action-button"
                    onClick={() => checkProgress(true)}
                >
                    See Progress
                </button>
            </div>
            <p className="hue board-completion">{completionText}</p>
        </>
    );
}

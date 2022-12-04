import { ChangeEvent, useEffect, useState, KeyboardEvent, useRef } from "react";
import "../styles/hue.css";
export type Nullable<T> = T | null;
//make selectable anchor points in browser. while selecting, set styling to anchor point on hover

function Hue() {
    const squareWidth = 100;
    const numberOfRows = 10;
    const numberOfColumns = 12;
    const [grid, setGrid] = useState([] as number[][][]);
    const [initialGrid, setInitialGrid] = useState([] as number[][][]);
    const [xGradient, setXGradient] = useState([] as number[]);
    const [yGradient, setYGradient] = useState([] as number[]);
    const [originColour, setOriginColour] = useState([] as number[]);
    const [anchorPoints, setAnchorPoints] = useState([
        [0, 0],
        [numberOfRows - 1, 0],
        [0, numberOfColumns - 1],
        [numberOfRows - 1, numberOfColumns - 1],
        [Math.ceil((numberOfRows - 1) / 2), 0],
        [Math.floor((numberOfRows - 1) / 2), 0],
        [Math.ceil((numberOfRows - 1) / 2), numberOfColumns - 1],
        [Math.floor((numberOfRows - 1) / 2), numberOfColumns - 1],
        [0, Math.ceil((numberOfColumns - 1) / 2)],
        [0, Math.floor((numberOfColumns - 1) / 2)],
        [numberOfRows - 1, Math.ceil((numberOfColumns - 1) / 2)],
        [numberOfRows - 1, Math.floor((numberOfColumns - 1) / 2)],
    ]);
    const [pointSelectedCoords, setPointSelectedCoords] = useState(
        [] as number[]
    );
    const [pointSelected, setPointSelected] = useState(false);
    const [anchoring, setAnchoring] = useState(true);

    useEffect(() => {
        initializeColours();
    }, []);

    useEffect(() => {
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
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
        ]);
        setYGradient([
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 5,
            (Math.random() - 0.5) * 5,
        ]);
    }

    function initializeGrid() {
        let grid = [] as number[][][];
        for (let i = 0; i < numberOfRows; i++) {
            grid.push([]);
            for (let j = 0; j < numberOfColumns; j++) {
                grid[i].push(
                    addArrayMultiple(
                        addArrayMultiple(originColour, xGradient, i),
                        yGradient,
                        j
                    )
                );
            }
        }
        setInitialGrid(grid.slice());
        setGrid(grid.slice());
    }

    function shuffleBoard() {
        setAnchoring(false);
        for (let i = 0; i < numberOfRows; i++) {
            for (let j = 0; j < numberOfColumns; j++) {
                if (
                    anchorPoints.findIndex((c) => c[0] === i && c[1] === j) ===
                    -1
                ) {
                    let swapI = Math.floor(Math.random() * numberOfRows);
                    let swapJ = Math.floor(Math.random() * numberOfColumns);
                    while (
                        anchorPoints.findIndex(
                            (c) => c[0] === swapI && c[1] === swapJ
                        ) !== -1
                    ) {
                        swapI = Math.floor(Math.random() * numberOfRows);
                        swapJ = Math.floor(Math.random() * numberOfColumns);
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
        if (anchoring) {
            if (
                anchorPoints.findIndex((c) => c[0] === i && c[1] === j) !== -1
            ) {
                //remove anchor point
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
            } else {
                setPointSelectedCoords([i, j]);
                setPointSelected(true);
            }
        }
    }

    function resetAnchorPoints() {
        setAnchorPoints([]);
    }

    return (
        <>
            <h1 id="title">Hue</h1>
            <div>
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
                                } ${
                                    anchorPoints.findIndex(
                                        (c) => c[0] === i && c[1] === j
                                    ) !== -1
                                        ? "anchor-point"
                                        : ""
                                }`}
                                style={{
                                    display: "table-cell",
                                    backgroundColor: `hsl(${cell[0]} ${cell[1]}% ${cell[2]}%)`,
                                    width: squareWidth,
                                    height: squareWidth,
                                }}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
            <div>
                <button className="action-button" onClick={shuffleBoard}>
                    Shuffle
                </button>
                <button className="action-button" onClick={initializeColours}>
                    New Game
                </button>
                <button className="action-button" onClick={resetAnchorPoints}>
                    Reset Fixed
                </button>
            </div>
        </>
    );
}

export default Hue;

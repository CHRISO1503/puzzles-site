import { ChangeEvent, useEffect, useState, KeyboardEvent, useRef } from "react";
import "../styles/hue.css";
export type Nullable<T> = T | null;

function Hue() {
    const squareWidth = 100;
    const numberOfRows = 10;
    const numberOfColumns = 12;
    const [grid, setGrid] = useState([] as number[][][]);
    const [initialGrid, setInitialGrid] = useState([] as number[][][]);
    const [xGradient, setXGradient] = useState([] as number[]);
    const [yGradient, setYGradient] = useState([] as number[]);
    const [originColour, setOriginColour] = useState([] as number[]);
    const anchorPoints = [
        [0, 0],
        [numberOfRows - 1, 0],
        [0, numberOfColumns - 1],
        [numberOfRows - 1, numberOfColumns - 1],
    ];

    useEffect(() => {
        initializeColours();
    }, []);

    useEffect(() => {
        initializeGrid();
    }, [yGradient]);

    function initializeColours() {
        setOriginColour([
            Math.random() * 360,
            Math.random() * 10 + 45,
            Math.random() * 10 + 45,
        ]);
        setXGradient([
            (Math.max(Math.random(), 0.3) - 0.5) * 30,
            (Math.max(Math.random(), 0.3) - 0.5) * 5,
            (Math.max(Math.random(), 0.3) - 0.5) * 5,
        ]);
        setYGradient([
            (Math.max(Math.random(), 0.3) - 0.5) * 30,
            (Math.max(Math.random(), 0.3) - 0.5) * 5,
            (Math.max(Math.random(), 0.3) - 0.5) * 5,
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
        for (let i = 0; i < numberOfRows; i++) {
            for (let j = 0; j < numberOfColumns; j++) {
                if (anchorPoints.findIndex((c) => c[0] === i && c[1] === j) === -1) {
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

    return (
        <>
            <div>
                {grid.map((row, i) => (
                    <div key={i} style={{ display: "table" }}>
                        {row.map((cell, j) => (
                            <div
                                key={j}
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
            <button className="action-button" onClick={shuffleBoard}>
                Shuffle
            </button>
        </>
    );
}

export default Hue;

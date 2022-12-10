import { useEffect, useState } from "react";
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
        console.log(tileNumbers);
    };

    function handleClick(i: number, j: number) {
        if (mines[i][j]) {
            showMines(i, j);
        } else if (tileNumbers[i][j] == 0) {
            uncoverTile(i, j);
        } else {
            uncoverTile(i, j);
            grid[i][j] = tileNumbers[i][j];
            setGrid(grid.map((row) => row.slice()));
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
    }

    return (
        <>
            <div>
                {grid.map((row, i) => (
                    <div
                        key={i}
                        style={{
                            display: "flex",
                        }}
                    >
                        {row.map((cell, j) => (
                            <img
                                key={j}
                                src={`src\\assets\\${TILE_ARRAY[cell]}.png`}
                                style={{ width: CELL_SIZE, height: CELL_SIZE }}
                                onClick={() => handleClick(i, j)}
                                draggable="false"
                            ></img>
                        ))}
                    </div>
                ))}
            </div>
        </>
    );
}

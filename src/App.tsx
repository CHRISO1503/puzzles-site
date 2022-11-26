import { ChangeEvent, useEffect, useState, KeyboardEvent, useRef } from "react";
import "./App.css";
export type Nullable<T> = T | null;
//look at catching promise
//attempted overwriting of current letter passes over it instead - only when selecting that letter with the arrow keys?

function App() {
    const rows = 12;
    const tableSize = 700;
    const [grid, setGrid] = useState([] as string[][]);
    const refs = useRef([] as Nullable<HTMLInputElement>[][]);
    const [direction, setDirection] = useState(true);
    const dice = [
        ["M", "M", "L", "L", "B", "Y"],
        ["V", "F", "G", "K", "P", "P"],
        ["H", "H", "N", "N", "R", "R"],
        ["D", "F", "R", "L", "L", "W"],
        ["R", "R", "D", "L", "G", "G"],
        ["X", "K", "B", "S", "Z", "N"],
        ["W", "H", "H", "T", "T", "P"],
        ["C", "C", "B", "T", "J", "D"],
        ["O", "I", "I", "N", "N", "Y"],
        ["A", "E", "I", "O", "U", "U"],
        ["A", "A", "E", "E", "O", "O"],
    ];
    const [letters, setLetters] = useState([] as string[]);
    const [boardErrors, setBoardErrors] = useState([] as string[]);
    const [floodedCoords, setFloodedCoords] = useState([] as number[][]);
    const floodCount = useRef(0);
    const [rowVisible, setRowVisible] = useState(0);
    const rowFadeTime = 250;

    useEffect(() => {
        rollDice();
        initializeGrid();
    }, []);

    function checkBoardValidity() {
        // Gets letters from rows and columns and passes them to checkRowValidity()
        let columnWord = [] as string[];
        let rowWord = [] as string[];
        let errors = [] as string[];
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < rows; j++) {
                columnWord.push(grid[i][j]);
                rowWord.push(grid[j][i]);
            }
            errors = errors.concat(checkRowValidity(columnWord));
            errors = errors.concat(checkRowValidity(rowWord));
            columnWord = [];
            rowWord = [];
        }
        // concat the return from checkAdjacencies which is an error of adjacencies or emptystring
        checkAdjacencies();
        if (floodCount.current < dice.length) {
            errors = errors.concat("All tiles must be adjacent! ");
            floodCount.current = 0;
            setFloodedCoords([]);
        }
        setBoardErrors(errors);
    }

    // Find an entry and flood fill on it
    function checkAdjacencies() {
        loopi: for (let i = 0; i < rows; i++) {
            for (let j = 0; j < rows; j++) {
                if (grid[i][j] != "") {
                    floodFill(i, j);
                    break loopi;
                }
            }
        }
    }

    function floodFill(i: number, j: number) {
        if (i < 0 || i >= rows || j < 0 || j >= rows) {
            return;
        }
        // Check if element is non empty and not checked
        if (
            grid[i][j] != "" &&
            floodedCoords.findIndex((c) => c[0] === i && c[1] === j) === -1
        ) {
            floodedCoords.push([i, j]);
            setFloodedCoords(floodedCoords.slice());
            floodCount.current++;
            floodFill(i + 1, j);
            floodFill(i - 1, j);
            floodFill(i, j + 1);
            floodFill(i, j - 1);
        }
    }

    function checkRowValidity(rowWord: string[]) {
        // Parses rowWord and determines errors if present. Returns an array of errors.
        rowWord = rowWord.filter(function (letter, index, arr) {
            if (letter == "" && arr[index - 1] != "") {
                return " ";
            }
            if (arr[index - 1] != "" || arr[index + 1] != "") {
                return letter;
            }
        });
        for (let i = 0; i < rowWord.length; i++) {
            if (rowWord[i] == "") {
                rowWord[i] = ":";
            }
        }
        let words = rowWord.join("").split(":");
        let errors = [] as string[];
        for (const x of words) {
            if (x.length == 0) {
            } else if (x.length == 2) {
                errors.push(
                    `Words have to be at least 3 letters. ${x} is only 2! `
                );
            } else if (!checkWordValidity(x)) {
                errors.push(`${x} is not a word! `);
            }
        }
        return errors;
    }

    function checkWordValidity(word: string) {
        var url = "https://api.dictionaryapi.dev/api/v2/entries/en/".concat(
            word
        );
        var http = new XMLHttpRequest();
        http.open("HEAD", url, false);
        http.send();
        if (http.status != 404) {
            return true;
        } else {
            return false;
        }
    }

    function initializeGrid() {
        let grid = [] as string[][];
        for (let i = 0; i < rows; i++) {
            grid.push([]);
            refs.current.push([]);
            for (let j = 0; j < rows; j++) {
                grid[i].push("");
                refs.current[i].push(null);
            }
        }
        setGrid(grid.slice());
        setBoardErrors([]);
        floodCount.current = 0;
        setFloodedCoords([]);
        setRowVisible(1);
    }

    function resetGrid() {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < rows; j++) {
                if (grid[i][j] != "") {
                    letters.push(grid[i][j]);
                    grid[i][j] = "";
                }
            }
        }
        setLetters(letters.slice());
        setGrid(grid.slice());
        floodCount.current = 0;
        setFloodedCoords([]);
        setRowVisible(0);
        setInterval(() => setRowVisible(1), 10);
    }

    function rollDice() {
        let letters = [] as string[];
        for (const x of dice) {
            letters.push(x[Math.floor(Math.random() * 6)]);
        }
        setLetters(letters);
        initializeGrid();
        setBoardErrors([]);
    }

    // This function only handles the placement of letters
    function changeLetter(
        e: ChangeEvent<HTMLInputElement>,
        i: number,
        j: number
    ) {
        if (e.target.value === "") {
            return;
        }
        let newVal = e.target.value[e.target.value.length - 1].toUpperCase();
        if (newVal == grid[i][j]) {
            passOver(i, j);
            return;
        }
        if (letters.includes(newVal)) {
            if (grid[i][j] != "") {
                letters.push(grid[i][j]);
            }
            grid[i][j] = newVal;
            setGrid(grid.slice());
            letters.splice(letters.indexOf(newVal), 1);
            if (letters.length == 0) {
                checkBoardValidity();
            }
            passOver(i, j);
        }
    }

    // This function handles the movement or removal of letters
    function handleKey(event: KeyboardEvent, i: number, j: number) {
        let dir = [0, 0] as [number, number];
        switch (event.key) {
            case "Tab":
                setDirection(!direction);
                event.preventDefault();
                break;
            case "Backspace":
                if (grid[i][j] == "") {
                    if (direction) {
                        dir = [0, -1];
                    } else {
                        dir = [-1, 0];
                    }
                }
                if (grid[i + dir[0]] && grid[i + dir[0]][j + dir[1]]) {
                    letters.push(grid[i + dir[0]][j + dir[1]]);
                    grid[i + dir[0]][j + dir[1]] = "";
                }
                setGrid(grid.slice());
                break;
            case "ArrowUp":
                dir = [-1, 0];
                break;
            case "ArrowDown":
                dir = [1, 0];
                break;
            case "ArrowLeft":
                dir = [0, -1];
                break;
            case "ArrowRight":
                dir = [0, 1];
                break;
        }
        if (letters.length > 0) {
            setBoardErrors([]);
        }
        moveFocus(dir, i, j);
    }

    function passOver(i: number, j: number) {
        if (direction) {
            refs.current[i][j + 1]?.focus();
        } else {
            refs.current[i + 1][j]?.focus();
        }
    }

    function moveFocus(movement: [number, number], i: number, j: number) {
        i += movement[0];
        j += movement[1];
        if (i >= rows) {
            i = 0;
        } else if (i < 0) {
            i = rows - 1;
        }
        if (j >= rows) {
            j = 0;
        } else if (j < 0) {
            j = rows - 1;
        }
        refs.current[i][j]?.focus();
    }

    function rowsFadeIn(i: number) {
        return rowFadeTime * (i + 1);
    }

    return (
        <>
            <h1 id="title">Q-Less</h1>
            <div>
                <table style={{ width: tableSize, height: tableSize }}>
                    <tbody>
                        {grid.map((row, i) => (
                            <tr
                                key={i}
                                style={{
                                    transitionDuration: `${rowsFadeIn(i)}ms`,
                                }}
                                className={`row ${
                                    rowVisible == 0 ? "hidden" : ""
                                }`}
                            >
                                {row.map((cell, j) => (
                                    <td key={j}>
                                        <input
                                            className="input"
                                            type="text"
                                            onChange={(e) =>
                                                changeLetter(e, i, j)
                                            }
                                            value={cell}
                                            ref={(el) =>
                                                (refs.current[i][j] = el)
                                            }
                                            onKeyDown={(e) =>
                                                handleKey(e, i, j)
                                            }
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                {letters.map((letter, i) => (
                    <div className="die-letter" key={i}>
                        {letter}
                    </div>
                ))}
            </div>
            <div>
                <button className="action-button" onClick={rollDice}>
                    Re-Roll
                </button>
                <button className="action-button" onClick={resetGrid}>
                    Reset Grid
                </button>
            </div>
            <p className="board-errors">{boardErrors}</p>
        </>
    );
}

export default App;

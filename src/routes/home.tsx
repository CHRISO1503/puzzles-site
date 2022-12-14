import { Link } from "react-router-dom";
import "../styles/home.css";

export default function Home() {
    return (
        <>
            <table className="nav-table text-crt crt">
                <tbody>
                    <tr>
                        <td className="home-td">
                            <Link to="/hue" className="nav-button">
                                Hue
                            </Link>
                        </td>
                    </tr>
                    <tr>
                        <td className="home-td">
                            <Link to="/qless" className="nav-button">
                                Q-Less
                            </Link>
                        </td>
                    </tr>
                    <tr>
                        <td className="home-td">
                            <Link to="/minesweeper" className="nav-button">
                                Minesweeper
                            </Link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

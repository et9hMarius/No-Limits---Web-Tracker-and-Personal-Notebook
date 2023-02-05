import "./Navbar.scss";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="Navbar">
      <nav id="navbar">
        <div className="left">
          <div className="logo">
            <img src="./icon-128.png" alt="logo" />
          </div>
          <div className="title">
            <h1>no limits</h1>
          </div>
        </div>
        <div className="right">
          <Link to="/">
            <div className="tracker">tracker</div>
          </Link>
          <Link to="/notepad">
            <div className="notepad">notepad</div>
          </Link>
        </div>
      </nav>
    </div>
  );
}

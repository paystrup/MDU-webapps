import { NavLink } from "react-router-dom";

export default function Navigation() {
    return(
        <nav>
            <li><NavLink to="/" key="1">Home</NavLink></li>
            <li><NavLink to="/about" key="1">About</NavLink></li>
        </nav>
    );
}
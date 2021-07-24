import React from 'react';
import { MDBIcon } from 'mdbreact';
import './components.css';

const NavBar = (props) => {
    return (
        <div id="navbar">
            <div className="navbar-item navbar-menu">
                <a href="/"><MDBIcon icon="ellipsis-h" size="2x" className="pink-text" /></a>
            </div>
            <div className="navbar-item navbar-profile">
                <a href="/"><MDBIcon icon="user" size="2x" className="pink-text" /></a>
            </div>
        </div>
    );
};

export default NavBar;

// src/components/nav/navbar.js

import React from 'react';
import { Link } from 'react-router-dom'
import './navbar.css'

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.logoutUser = this.logoutUser.bind(this);
        this.getLinks = this.getLinks.bind(this);
    }

    logoutUser(e) {
        e.preventDefault();
        this.props.logout();
    }

    // Selectively render links dependent on whether the user is logged in
    getLinks() {
        if (this.props.loggedIn) {
            return (
                <div>
                    <Link className="session-link" to={'/tweets'}>All Tweets</Link>
                    <Link className="session-link" to={'/profile'}>Profile</Link>
                    <Link className="session-link" to={'/new_tweet'}>Write a Tweet</Link>
                    <button onClick={this.logoutUser}>Logout</button>
                </div>
            );
        } else {
            return (
                <div>
                    <Link className="session-link" to={'/signup'}>Signup</Link>
                    <Link className="session-link" to={'/login'}>Login</Link>
                </div>
            );
        }
    }

    render() {
        return (
            <div>
                <h1>Chirper</h1>
                {this.getLinks()}
            </div>
        );
    }
}

export default NavBar;

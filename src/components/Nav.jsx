import React from 'react';
import { Link } from 'react-router-dom'
import { logout } from '../helpers/loginState';
import { withRouter } from "react-router-dom";

const Nav = (props) => {
    return (
        <nav>
        <Link to='/'>Home</Link>
        <Link to='/drawing/'>New Drawing</Link>
        <div className='text-white' onClick={async () => {
        	await logout(props)
        }}>Logout</div>
      </nav>
    )
}

export default withRouter(Nav);
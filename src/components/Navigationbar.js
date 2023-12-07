import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navigationbar.css'

const Navbar = () => {
  const location = useLocation()

  return (
    <div className="navbar">
      <div id="my-name">Product Management System</div>
      <Link
        to="/new"
        className={`nav-button ${location.pathname === '/new' ? 'active' : ''}`}
      >
        New
      </Link>
      <Link
        to="/summary"
        className={`nav-button ${
          location.pathname === '/summary' ? 'active' : ''
        }`}
      >
        Summary
      </Link>
    </div>
  )
}

export default Navbar

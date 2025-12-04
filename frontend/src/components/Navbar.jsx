import React from 'react'
import './Navbar.css'

const Navbar = ({ connectWallet }) => {
  return (
    <div className='navbar'>
      <div className='navbar-title'>
        <h1>Freelance Blockchain</h1>
      </div>

      <div className='navbar-connect-button'>
        <button className="connect-btn" onClick={connectWallet}>
          <span class="material-symbols-outlined">wallet</span>
          Connect Wallet
        </button>
      </div>
    </div>
  )
}

export default Navbar

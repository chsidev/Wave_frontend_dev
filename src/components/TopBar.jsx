import React, { useState, useEffect, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { menuConfig } from '../utils/constants.ts'
import Avatar from './Avatar.jsx'

const TopBar = () => {
  const currentUrl = new URL(window.location.href)
  const { address, isConnected, isConnecting, isDisconnected, status } = useAccount()

  // Debug logging
  console.log('Wallet Status:', { address, isConnected, isConnecting, isDisconnected, status })

  return (
    <>
      <header className="header">
        <div className="mainmenu-area">
          <nav className="navbar navbar-expand-lg navbar-light">
                  <div className="container-fluid p-0 w-100">
                    <a className="navbar-brand" href="index.html">
                      <img src="/logo.png" alt="Wave Logo" className="navbar-logo" width={40} height={40} />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                      data-bs-target="#main_menu" aria-controls="main_menu" aria-expanded="false"
                      aria-label="Toggle navigation">
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="main_menu">
                      <div className="navbar-nav-wrapper d-flex justify-content-end align-items-center w-100">
                        <ul className="navbar-nav d-flex align-items-center me-4">
                          {
                            menuConfig.map((item, index) => {
                              return (
                                <li className="nav-item" key={index}>
                                  <a className={currentUrl.pathname == item.link ? "nav-link active" : "nav-link"} href={item.link}> {item.name}</a>
                                  <div className="mr-hover-effect"></div>
                                </li>
                              )
                            })
                          }
                        </ul>
                        <div className="d-flex  align-items-center">
                          {isConnected ? (
                            <Avatar />
                          ) : (
                            <w3m-button />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
          </nav>
        </div>
        <div className="header-gradient-line"></div>
      </header>
    </>
  )
}

export default TopBar

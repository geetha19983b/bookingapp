import React, { useState } from 'react';

export default function TopNavbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="bg-navbar-bg border-b border-sidebar shadow-xl">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Title and Search */}
        <div className="flex items-center gap-6 flex-1">
          <h1 className="text-xl font-semibold text-navbar-text">All Items</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search in Items ( / )"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-2.5 border border-sidebar rounded-xl leading-5 bg-sidebar-hover bg-opacity-50 text-white placeholder-sidebar-muted focus:outline-none focus:placeholder-accent-light focus:ring-2 focus:ring-accent-cyan focus:border-accent-cyan focus:bg-sidebar-hover text-sm transition-all shadow-inner"
            />
          </div>

          <button className="p-2.5 text-sidebar-muted hover:text-white hover:bg-navbar-hover rounded-xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Right Section - User Info and Actions */}
        <div className="flex items-center gap-3">
          {/* Company Selector */}
          <div className="flex items-center gap-2 px-4 py-2.5 bg-sidebar-hover bg-opacity-50 rounded-xl border border-sidebar hover:bg-navbar-hover transition-all cursor-pointer shadow-inner">
            <span className="text-sm font-semibold text-white">ATVA SOLUTIONS</span>
            <svg className="w-4 h-4 text-accent-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* New Button */}
          <button className="btn-theme-primary px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            New
          </button>

          {/* More Actions */}
          <button className="p-2.5 text-sidebar-muted hover:text-white hover:bg-navbar-hover rounded-xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

          {/* Notifications */}
          <button className="p-2.5 text-sidebar-muted hover:text-white hover:bg-navbar-hover rounded-xl transition-all relative">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-accent-cyan to-accent-blue rounded-full ring-2 ring-navbar-bg animate-pulse"></span>
          </button>

          {/* Settings */}
          <button className="p-2.5 text-sidebar-muted hover:text-white hover:bg-navbar-hover rounded-xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* User Avatar */}
          <div className="relative">
            <button 
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-10 h-10 bg-gradient-to-br from-accent-blue via-accent-cyan to-accent-blue rounded-full flex items-center justify-center text-white font-bold text-sm hover:shadow-xl transition-all ring-2 ring-transparent hover:ring-accent-cyan transform hover:scale-105"
            >
              G
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-navbar-bg rounded-xl shadow-2xl py-2 border border-sidebar z-50 backdrop-blur-sm">
                <a href="#profile" className="block px-4 py-2.5 text-sm text-sidebar-muted hover:bg-sidebar-hover hover:text-white transition-all rounded-lg mx-2">Your Profile</a>
                <a href="#settings" className="block px-4 py-2.5 text-sm text-sidebar-muted hover:bg-sidebar-hover hover:text-white transition-all rounded-lg mx-2">Settings</a>
                <hr className="my-2 border-sidebar" />
                <a href="#logout" className="block px-4 py-2.5 text-sm text-red-400 hover:bg-sidebar-hover transition-all rounded-lg mx-2 font-medium">Sign out</a>
              </div>
            )}
          </div>

          {/* Menu Toggle */}
          <button className="p-2 text-sidebar-muted hover:text-navbar-text hover:bg-navbar-hover rounded-lg transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

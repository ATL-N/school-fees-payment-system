import React from 'react';
import { Link } from 'react-router-dom';

import './DashboardAdmin.css'; 

export const DashboardAdmin = () => {
    return (
        <div className="dashboard">
            <header className="header">
                <h1>Welcome, [User Name]</h1>
            </header>

            <nav className="nav">
                <ul className="nav-ul">
                    <li className="nav-li"> <Link to="/addContact" className='nav-a'><button>Add Contact</button></Link> </li>
                    <li className="nav-li"><a className="nav-a" href="#">Home</a></li>
                    <li className="nav-li"><a className="nav-a" href="#">Profile</a></li>
                    <li className="nav-li"><a className="nav-a" href="#">Payments</a></li>
                    <li className="nav-li"><a className="nav-a" href="#">Notifications</a></li>
                    <li className="nav-li"><a className="nav-a" href="#">Logout</a></li>
                </ul>
            </nav>

            <main className="main">
                <section className="widget">
                    {/* User Profile Widget */}
                    <div className="profile">
                        {/* User profile picture and information */}
                    </div>
                </section>

                <section className="widget">
                    {/* Student Information Widget (For Parents) */}
                    <div className="student-info">
                        {/* Student details and academic progress */}
                    </div>
                </section>

                <section className="widget">
                    {/* Fee Summary Widget */}
                    <div className="fee-summary">
                        {/* Fee summary information */}
                    </div>
                </section>

                <section className="widget">
                    {/* Payment History Widget */}
                    <div className="payment-history">
                        {/* Recent payment transactions */}
                    </div>
                </section>

                <section className="widget">
                    {/* Notification Widget */}
                    <div className="notifications">
                        {/* Upcoming due dates, payment confirmations, announcements */}
                    </div>
                </section>

                {/* Add more widgets as needed */}
            </main>

            <footer className="footer">
                <p>&copy; 2023 Your School Name</p>
            </footer>
        </div>
    );
};

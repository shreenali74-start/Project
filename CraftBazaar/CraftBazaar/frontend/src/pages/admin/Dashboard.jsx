import React from 'react';
import { Link } from 'react-router-dom';

const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    padding: '32px',
    textAlign: 'center',
    flex: 1,
    margin: '16px',
    transition: 'transform 0.2s',
};

const cardHover = {
    ...cardStyle,
    transform: 'scale(1.03)',
};

function Dashboard() {
    const [hovered, setHovered] = React.useState(null);

    const cards = [
        { name: 'Products', link: '/admin/products', icon: '🛍' },
        { name: 'Users', link: '/admin/users', icon: '👤' },
        { name: 'Orders', link: '/admin/orders', icon: '📦' },
    ];

    return (
        <div
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                padding: '40px',
            }}
        >
            <h2 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
                Admin Dashboard
            </h2>
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'stretch',
                    gap: '16px',
                }}
            >
                {cards.map((card, idx) => (
                    <Link
                        key={card.name}
                        to={card.link}
                        style={hovered === idx ? cardHover : cardStyle}
                        onMouseEnter={() => setHovered(idx)}
                        onMouseLeave={() => setHovered(null)}
                    >
                        <div style={{ fontSize: '48px', marginBottom: '16px' }}>{card.icon}</div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#333' }}>{card.name}</div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
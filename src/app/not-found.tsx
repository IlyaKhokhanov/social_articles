'use client';

import Link from 'next/link';

const NotFound = () => {
  return (
    <div
      className="page404"
      style={{
        margin: '0 auto',
        padding: '0',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '90vw',
        height: '90vh',
        gap: '20px',
      }}
    >
      <h2>Страница не найдена</h2>
      <Link href="/">Домой</Link>
    </div>
  );
};

export default NotFound;

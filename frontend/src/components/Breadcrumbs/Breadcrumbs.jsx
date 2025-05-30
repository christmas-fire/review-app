import React from 'react';
import styles from './Breadcrumbs.module.css';
import { Link } from 'react-router-dom';

function Breadcrumbs({ items }) {
  if (!items || items.length === 0) return null;
  return (
    <nav className={styles.breadcrumbs + ' ' + styles.breadcrumbsCenter} aria-label="breadcrumb">
      {items.map((item, idx) => (
        <span key={idx} className={styles.breadcrumbItem}>
          {item.to && idx !== items.length - 1 ? (
            <Link to={item.to} className={styles.breadcrumbLink}>{item.label}</Link>
          ) : (
            <span className={styles.breadcrumbCurrent}>{item.label}</span>
          )}
          {idx < items.length - 1 && <span className={styles.separator}> &gt; </span>}
        </span>
      ))}
    </nav>
  );
}

export default Breadcrumbs; 
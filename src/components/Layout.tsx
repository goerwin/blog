import { graphql, Link, useStaticQuery } from 'gatsby';
import React from 'react';
import * as styles from './Layout.module.css';

export default function Layout({ children }: any) {
  const data = useStaticQuery(graphql`
    query HeaderQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className={styles.container}>
      <LayoutContent>
        <header className={styles.header}>
          <Link to="/">{data.site.siteMetadata.title}</Link>
        </header>
      </LayoutContent>
      {children}
    </div>
  );
}

export function LayoutContent(props: any) {
  return (
    <div className={styles.content + ` ${props.className ?? ''}`}>
      {props.children}
    </div>
  );
}

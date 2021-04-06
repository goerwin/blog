import { graphql, useStaticQuery } from 'gatsby';
import * as React from 'react';
import * as styles from './Bio.module.css';

export default function Bio(props: any) {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
            avatar
            siteUrl
          }
        }
      }
    }
  `);

  const { name, summary, avatar, siteUrl } = data.site.siteMetadata?.author;

  return (
    <div {...props} className={styles.container}>
      <img src={avatar} alt="Profile picture" />
      <div>
        <p>
          Personal blog by <a href={siteUrl}>{name}</a>
        </p>
        <span>{summary}</span>
      </div>
    </div>
  );
}

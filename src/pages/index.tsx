import * as React from 'react';
import { Link, graphql } from 'gatsby';
import Bio from '../components/Bio';
import Layout, { LayoutContent } from '../components/Layout';
import SEO from '../components/Seo';
import * as styles from './index.module.css';

function Login() {
  const { isLoading, data } = usePost((attrs) => sendPostInfo(attrs));

  return (
    <div className={styles.container}>
      <span>34234</span>
    </div>
  );
}

export default function Index({ data, location }: any) {
  const siteTitle = data.site.siteMetadata?.title || `Title`;
  const posts = data.allMarkdownRemark.nodes;

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />

      <LayoutContent>
        <Bio />
        <ol className={styles.blogListContainer}>
          {posts.map((post: any) => (
            <li key={post.fields.slug}>
              <article className={styles.article}>
                <h2>
                  <Link to={post.fields.slug}>{post.frontmatter.title}</Link>
                </h2>
                <small>{post.frontmatter.date}</small>
                <p
                  dangerouslySetInnerHTML={{
                    __html: post.frontmatter.description,
                  }}
                />
              </article>
            </li>
          ))}
        </ol>
      </LayoutContent>
    </Layout>
  );
}

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`;

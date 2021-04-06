import * as React from 'react';
import { graphql, Link } from 'gatsby';
import Layout, { LayoutContent } from '../components/Layout';
import SEO from '../components/Seo';

export default function NotFound() {
  return (
    <Layout>
      <LayoutContent>
        <SEO title="404: Not Found" />
        <h1>404: Not Found</h1>
        <p>You just hit a route that doesn&#39;t exist... the sadness.</p>
        <Link to="/">Take me home</Link>
      </LayoutContent>
    </Layout>
  );
}

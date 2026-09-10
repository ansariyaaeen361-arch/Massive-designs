import Head from 'next/head';
import '../styles/globals.css';
import Layout from '../components/layout/Layout';
import WelcomePopup from '../components/layout/WelcomePopup';
import PageViewTracker from '../components/layout/PageViewTracker';

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <WelcomePopup />
      <PageViewTracker />
    </>
  );
}

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="google-site-verification" content="ylkbZlANZoOBPW3ASMfmGFwzM1KZ827scc7BlMhN3iQ" />
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="https://api.mentalforge.ai/widget.js" data-business="6a5ed1210c0425af0e149afc" />
      </body>
    </Html>
  );
}

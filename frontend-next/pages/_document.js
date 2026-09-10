import { Html, Head, Main, NextScript } from 'next/document';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <meta name="google-site-verification" content="ylkbZlANZoOBPW3ASMfmGFwzM1KZ827scc7BlMhN3iQ" />
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`,
              }}
            />
          </>
        )}
        {CLARITY_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${CLARITY_ID}");`,
            }}
          />
        )}
      </Head>
      <body>
        <Main />
        <NextScript />
        <script src="https://api.mentalforge.ai/widget.js" data-business="6a5ed1210c0425af0e149afc" />
      </body>
    </Html>
  );
}

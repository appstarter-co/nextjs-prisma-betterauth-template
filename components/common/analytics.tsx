"use client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const GA_ID = process.env.PUBLIC_GOOGLE_ANALYTICS_ID;
const ADOBE_ID = process.env.PUBLIC_ADOBE_ANALYTICS_ID; // Edge Config ID (e.g. aaaaaaaa11111111@AdobeOrg)
const ADOBE_ORG_ID = process.env.PUBLIC_ADOBE_ANALYTICS_ORG_ID; 

export default function AnalyticsScripts() {
  return (
    <>
      {/* Google Analytics */}
      {GA_ID && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `,
            }}
          />
        </>
      )}

      {/* Adobe Analytics via Alloy.js */}
      {ADOBE_ID && (
        <>
          <script
            async
            src="https://cdn1.adoberesources.net/alloy/2.19.1/alloy.js"
          ></script>
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Adobe Alloy setup after full window load
                window.addEventListener('load', function () {
                  if (typeof alloy !== 'function') {
                    console.warn('[Adobe Analytics] alloy not ready');
                    return;
                  }

                  // Configure (replace orgId if needed)
                  alloy("configure", {
                    edgeConfigId: "${ADOBE_ID}",
                    orgId: "${ADOBE_ORG_ID}",
                    debugEnabled: true,
                    clickCollectionEnabled: true
                  });
                });
              `,
            }}
          />
        </>
      )}
    </>
  );
}

export function RouteAnalytics() {
  const pathname = usePathname();
  const search = useSearchParams();

  useEffect(() => {
    const alloyFn = (window as any).alloy;
    if (typeof alloyFn === "function") {
      alloyFn("sendEvent", {
        xdm: {
          eventType: "web.webpagedetails.pageViews",
          web: {
            webPageDetails: {
              URL: window.location.href,
              name: document.title
            },
            webReferrer: {
              URL: document.referrer
            }
          }
        }
      });
    }
    if ((window as any).gtag) {
      (window as any).gtag("event", "page_view", {
        page_path: window.location.pathname,
        page_title: document.title
      });
    }
  }, [pathname, search?.toString()]);

  return null;
}
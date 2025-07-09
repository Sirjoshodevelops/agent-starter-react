import { Suspense } from 'react';
import { headers } from 'next/headers';
import { EmbeddedWidget } from '@/components/widget/embedded-widget';
import { getAppConfig, getOrigin } from '@/lib/utils';

export default async function EmbedPage() {
  const hdrs = await headers();
  const origin = getOrigin(hdrs);
  const appConfig = await getAppConfig(origin);

  return (
    <html lang="en" className="h-full">
      <head>
        <title>{appConfig.pageTitle} - Widget</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="h-full m-0 p-0 overflow-hidden">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center bg-white">
            <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"></div>
          </div>
        }>
          <EmbeddedWidget appConfig={appConfig} />
        </Suspense>
      </body>
    </html>
  );
}
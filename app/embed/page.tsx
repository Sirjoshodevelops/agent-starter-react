import { Suspense } from 'react';
import { headers } from 'next/headers';
import { EmbeddedWidget } from '@/components/widget/embedded-widget';
import { getAppConfig, getOrigin } from '@/lib/utils';

export default async function EmbedPage() {
  const hdrs = await headers();
  const origin = getOrigin(hdrs);
  const appConfig = await getAppConfig(origin);

  return (
    <Suspense fallback={<div>Loading widget...</div>}>
      <EmbeddedWidget appConfig={appConfig} />
    </Suspense>
  );
}
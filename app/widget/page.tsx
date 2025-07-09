import { headers } from 'next/headers';
import { WidgetBuilder } from '@/components/widget/widget-builder';
import { getAppConfig, getOrigin } from '@/lib/utils';

export default async function WidgetBuilderPage() {
  const hdrs = await headers();
  const origin = getOrigin(hdrs);
  const appConfig = await getAppConfig(origin);

  return <WidgetBuilder appConfig={appConfig} />;
}
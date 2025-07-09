'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { AppConfig } from '@/lib/types';
import type { WidgetConfig } from '@/lib/widget-types';

interface WidgetPreviewProps {
  config: WidgetConfig;
  appConfig: AppConfig;
}

export function WidgetPreview({ config, appConfig }: WidgetPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const configParam = encodeURIComponent(JSON.stringify(config));
      iframe.src = `/embed?config=${configParam}&preview=true`;
    }
  }, [config]);

  const getPositionStyles = () => {
    const styles: React.CSSProperties = {
      position: 'absolute',
      width: config.showMinimized ? '60px' : `${config.width}px`,
      height: config.showMinimized ? '60px' : `${config.height}px`,
      zIndex: config.zIndex,
    };

    switch (config.position) {
      case 'bottom-right':
        styles.bottom = '20px';
        styles.right = '20px';
        break;
      case 'bottom-left':
        styles.bottom = '20px';
        styles.left = '20px';
        break;
      case 'top-right':
        styles.top = '20px';
        styles.right = '20px';
        break;
      case 'top-left':
        styles.top = '20px';
        styles.left = '20px';
        break;
    }

    return styles;
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Mock website content */}
      <div className="p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Website</h1>
          <p className="text-gray-600 mb-6">
            This is a preview of how the widget will appear on your website. The widget will be
            positioned according to your configuration settings.
          </p>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>

      {/* Widget iframe */}
      <iframe
        ref={iframeRef}
        style={getPositionStyles()}
        className="border-0 rounded-lg shadow-lg"
        title="Widget Preview"
      />
    </div>
  );
}
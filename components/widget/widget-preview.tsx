'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { AppConfig } from '@/lib/types';
import type { WidgetConfig } from '@/lib/widget-types';

interface WidgetPreviewProps {
  config: WidgetConfig;
  appConfig: AppConfig;
}

export function WidgetPreview({ config, appConfig }: WidgetPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (iframeRef.current) {
      setIsLoading(true);
      const iframe = iframeRef.current;
      const configParam = encodeURIComponent(JSON.stringify(config));
      iframe.src = `/embed?config=${configParam}&preview=true`;
      
      const handleLoad = () => setIsLoading(false);
      iframe.addEventListener('load', handleLoad);
      
      return () => iframe.removeEventListener('load', handleLoad);
    }
  }, [config]);

  const getPositionStyles = () => {
    const styles: React.CSSProperties = {
      position: 'absolute',
      width: config.showMinimized ? '64px' : `${config.width}px`,
      height: config.showMinimized ? '64px' : `${config.height}px`,
      zIndex: config.zIndex,
      transition: 'all 0.3s ease',
      borderRadius: config.showMinimized ? '50%' : `${config.borderRadius}px`,
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    };

    switch (config.position) {
      case 'bottom-right':
        styles.bottom = '24px';
        styles.right = '24px';
        break;
      case 'bottom-left':
        styles.bottom = '24px';
        styles.left = '24px';
        break;
      case 'top-right':
        styles.top = '24px';
        styles.right = '24px';
        break;
      case 'top-left':
        styles.top = '24px';
        styles.left = '24px';
        break;
    }

    return styles;
  };

  return (
    <div className="relative w-full h-full">
      {/* Mock website content */}
      <div className="absolute inset-0 overflow-hidden bg-white">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
              <span className="font-semibold text-gray-900">Your Website</span>
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-gray-600">Home</span>
              <span className="text-sm text-gray-600">About</span>
              <span className="text-sm text-gray-600">Contact</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              Welcome to Your Website
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              This is a preview of how the LiveKit Voice Assistant widget will appear on your website. 
              The widget positioning and styling will match your configuration.
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium">
                Get Started
              </div>
              <div className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium">
                Learn More
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-16 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 border border-gray-200 rounded-xl">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg mb-4"></div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Feature {i}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-900 text-white px-8 py-12">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-400">© 2024 Your Website. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Loading preview...</span>
          </div>
        </div>
      )}

      {/* Widget iframe */}
      <iframe
        ref={iframeRef}
        style={getPositionStyles()}
        className="border-0 bg-white"
        title="Widget Preview"
        allow="microphone; camera"
      />

      {/* Position indicator */}
      <div className="absolute top-4 left-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
        Position: {config.position.replace('-', ' ')}
      </div>

      {/* Size indicator */}
      <div className="absolute top-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs font-medium z-10">
        {config.showMinimized ? '64×64px (minimized)' : `${config.width}×${config.height}px`}
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Room } from 'livekit-client';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { XIcon, MinusIcon, DragHandleDots2Icon } from '@phosphor-icons/react/dist/ssr';
import { motion, AnimatePresence } from 'motion/react';
import { App } from '@/components/app';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AppConfig } from '@/lib/types';
import type { WidgetConfig } from '@/lib/widget-types';

interface EmbeddedWidgetProps {
  appConfig: AppConfig;
}

const defaultConfig: WidgetConfig = {
  theme: 'light',
  primaryColor: '#002cf2',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  borderRadius: 12,
  position: 'bottom-right',
  size: 'medium',
  width: 400,
  height: 600,
  autoOpen: false,
  showMinimized: true,
  enableDragging: false,
  showHeader: true,
  showBranding: true,
  customTitle: '',
  customSubtitle: '',
  customCSS: '',
  zIndex: 1000,
};

export function EmbeddedWidget({ appConfig }: EmbeddedWidgetProps) {
  const searchParams = useSearchParams();
  const [isMinimized, setIsMinimized] = useState(true);
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig);
  const [isPreview, setIsPreview] = useState(false);
  const room = useMemo(() => new Room(), []);

  useEffect(() => {
    const configParam = searchParams.get('config');
    const previewParam = searchParams.get('preview');
    
    if (configParam) {
      try {
        const parsedConfig = JSON.parse(decodeURIComponent(configParam));
        setConfig({ ...defaultConfig, ...parsedConfig });
      } catch (error) {
        console.error('Failed to parse widget config:', error);
      }
    }

    if (previewParam === 'true') {
      setIsPreview(true);
    }

    // Auto-open if configured
    if (config.autoOpen && !config.showMinimized) {
      setIsMinimized(false);
    } else {
      setIsMinimized(config.showMinimized);
    }
  }, [searchParams, config.autoOpen, config.showMinimized]);

  const getSizeClasses = () => {
    switch (config.size) {
      case 'small':
        return 'w-80 h-96';
      case 'large':
        return 'w-[500px] h-[700px]';
      default:
        return `w-[${config.width}px] h-[${config.height}px]`;
    }
  };

  const getThemeClasses = () => {
    switch (config.theme) {
      case 'dark':
        return 'dark';
      case 'light':
        return '';
      default:
        return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : '';
    }
  };

  const customStyles = {
    '--primary': config.primaryColor,
    '--background': config.backgroundColor,
    '--foreground': config.textColor,
    borderRadius: `${config.borderRadius}px`,
  } as React.CSSProperties;

  if (isPreview) {
    return (
      <div className="w-full h-full">
        <WidgetContent
          config={config}
          appConfig={appConfig}
          isMinimized={isMinimized}
          onToggleMinimize={() => setIsMinimized(!isMinimized)}
          room={room}
        />
      </div>
    );
  }

  return (
    <div className={cn('fixed inset-0 pointer-events-none', getThemeClasses())}>
      <style dangerouslySetInnerHTML={{ __html: config.customCSS }} />
      <div
        className="pointer-events-auto"
        style={{
          position: 'fixed',
          zIndex: config.zIndex,
          ...customStyles,
        }}
      >
        <WidgetContent
          config={config}
          appConfig={appConfig}
          isMinimized={isMinimized}
          onToggleMinimize={() => setIsMinimized(!isMinimized)}
          room={room}
        />
      </div>
    </div>
  );
}

interface WidgetContentProps {
  config: WidgetConfig;
  appConfig: AppConfig;
  isMinimized: boolean;
  onToggleMinimize: () => void;
  room: Room;
}

function WidgetContent({ config, appConfig, isMinimized, onToggleMinimize, room }: WidgetContentProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (config.enableDragging) {
      setIsDragging(true);
      // Add drag logic here if needed
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isMinimized ? (
        <motion.div
          key="minimized"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="w-14 h-14 bg-primary rounded-full shadow-lg cursor-pointer flex items-center justify-center hover:scale-110 transition-transform"
          onClick={onToggleMinimize}
          style={{ backgroundColor: config.primaryColor }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
              fill="currentColor"
            />
          </svg>
        </motion.div>
      ) : (
        <motion.div
          key="expanded"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'bg-background border shadow-2xl overflow-hidden',
            config.size === 'small' && 'w-80 h-96',
            config.size === 'medium' && 'w-[400px] h-[600px]',
            config.size === 'large' && 'w-[500px] h-[700px]'
          )}
          style={{
            borderRadius: `${config.borderRadius}px`,
            width: config.width,
            height: config.height,
          }}
        >
          {config.showHeader && (
            <div
              className="flex items-center justify-between p-3 border-b bg-muted/50"
              onMouseDown={handleMouseDown}
              style={{ cursor: config.enableDragging ? 'move' : 'default' }}
            >
              <div className="flex items-center gap-2">
                {config.enableDragging && (
                  <DragHandleDots2Icon size={16} className="text-muted-foreground" />
                )}
                <div>
                  <h3 className="font-semibold text-sm">
                    {config.customTitle || appConfig.pageTitle}
                  </h3>
                  {(config.customSubtitle || appConfig.pageDescription) && (
                    <p className="text-xs text-muted-foreground">
                      {config.customSubtitle || appConfig.pageDescription}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleMinimize}
                  className="h-6 w-6 p-0"
                >
                  <MinusIcon size={14} />
                </Button>
              </div>
            </div>
          )}

          <div className="flex-1 relative">
            <RoomContext.Provider value={room}>
              <RoomAudioRenderer />
              <StartAudio label="Start Audio" />
              <App appConfig={appConfig} />
            </RoomContext.Provider>
          </div>

          {config.showBranding && (
            <div className="px-3 py-2 border-t bg-muted/30">
              <p className="text-xs text-muted-foreground text-center">
                Powered by{' '}
                <a
                  href="https://livekit.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                >
                  LiveKit
                </a>
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
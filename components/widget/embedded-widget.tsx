'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Room } from 'livekit-client';
import { RoomAudioRenderer, RoomContext, StartAudio } from '@livekit/components-react';
import { XIcon, MinusIcon, ChatCircleIcon } from '@phosphor-icons/react/dist/ssr';
import { DragHandleDots2Icon } from '@phosphor-icons/react';
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
  borderRadius: 16,
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
  const [mounted, setMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [config, setConfig] = useState<WidgetConfig | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [resolvedThemeClass, setResolvedThemeClass] = useState('');
  const room = useMemo(() => new Room(), []);

  useEffect(() => {
    const configParam = searchParams.get('config');
    const previewParam = searchParams.get('preview');
    
    let parsedConfig = defaultConfig;
    if (configParam) {
      try {
        const configFromParam = JSON.parse(decodeURIComponent(configParam));
        parsedConfig = { ...defaultConfig, ...configFromParam };
      } catch (error) {
        console.error('Failed to parse widget config:', error);
      }
    }

    setConfig(parsedConfig);
    setIsPreview(previewParam === 'true');

    // Resolve theme class
    const getThemeClasses = () => {
      switch (parsedConfig.theme) {
        case 'dark':
          return 'dark';
        case 'light':
          return '';
        default:
          return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : '';
      }
    };

    setResolvedThemeClass(getThemeClasses());

    // Set initial minimized state
    if (parsedConfig.autoOpen && !parsedConfig.showMinimized) {
      setIsMinimized(false);
    } else {
      setIsMinimized(parsedConfig.showMinimized);
    }

    setMounted(true);
  }, [searchParams]);

  const customStyles = config ? {
    '--primary': config.primaryColor,
    '--background': config.backgroundColor,
    '--foreground': config.textColor,
  } as React.CSSProperties : {};

  if (!mounted || !config) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-white">
        <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (isPreview) {
    return (
      <div className={cn('w-full h-full', resolvedThemeClass)} style={customStyles}>
        <style dangerouslySetInnerHTML={{ __html: config.customCSS }} />
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
    <div className={cn('fixed inset-0 pointer-events-none', resolvedThemeClass)} style={customStyles}>
      <style dangerouslySetInnerHTML={{ __html: config.customCSS }} />
      <div
        className="pointer-events-auto"
        style={{
          position: 'fixed',
          zIndex: config.zIndex,
          ...(config.position === 'bottom-right' && { bottom: '20px', right: '20px' }),
          ...(config.position === 'bottom-left' && { bottom: '20px', left: '20px' }),
          ...(config.position === 'top-right' && { top: '20px', right: '20px' }),
          ...(config.position === 'top-left' && { top: '20px', left: '20px' }),
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
  const [isHovered, setIsHovered] = useState(false);

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
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div
            className="w-16 h-16 rounded-full shadow-2xl cursor-pointer flex items-center justify-center relative overflow-hidden"
            onClick={onToggleMinimize}
            style={{ 
              backgroundColor: config.primaryColor,
              borderRadius: `${config.borderRadius}px`,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
            
            {/* Icon */}
            <ChatCircleIcon size={24} className="text-white relative z-10" weight="fill" />
            
            {/* Pulse animation */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-white/30"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Tooltip */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap"
              >
                {config.customTitle || appConfig.pageTitle}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          key="expanded"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-background border shadow-2xl overflow-hidden widget-container flex flex-col"
          style={{
            borderRadius: `${config.borderRadius}px`,
            width: config.width,
            height: config.height,
            backgroundColor: config.backgroundColor,
          }}
        >
          {config.showHeader && (
            <div
              className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-gray-50 to-gray-100 widget-header flex-shrink-0"
              onMouseDown={handleMouseDown}
              style={{ cursor: config.enableDragging ? 'move' : 'default' }}
            >
              <div className="flex items-center gap-3">
                {config.enableDragging && (
                  <DragHandleDots2Icon size={16} className="text-gray-400" />
                )}
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ backgroundColor: config.primaryColor }}
                  />
                  <div>
                    <h3 className="font-semibold text-sm text-gray-900">
                      {config.customTitle || appConfig.pageTitle}
                    </h3>
                    {(config.customSubtitle || appConfig.pageDescription) && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {config.customSubtitle || appConfig.pageDescription}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleMinimize}
                  className="h-7 w-7 p-0 hover:bg-gray-200 rounded-full"
                >
                  <MinusIcon size={14} />
                </Button>
              </div>
            </div>
          )}

          <div className="flex-1 relative bg-background overflow-hidden">
            <RoomContext.Provider value={room}>
              <RoomAudioRenderer />
              <StartAudio label="Start Audio" />
              <div className="h-full w-full">
                <App appConfig={appConfig} />
              </div>
            </RoomContext.Provider>
          </div>

          {config.showBranding && (
            <div className="px-4 py-2 border-t bg-gray-50/80 backdrop-blur-sm flex-shrink-0">
              <p className="text-xs text-gray-500 text-center">
                Powered by{' '}
                <a
                  href="https://livekit.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-gray-700 transition-colors"
                  style={{ color: config.primaryColor }}
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
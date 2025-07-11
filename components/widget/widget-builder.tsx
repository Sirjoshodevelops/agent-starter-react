'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  CopyIcon, 
  EyeIcon, 
  CodeIcon, 
  PaletteIcon, 
  LayoutIcon, 
  GearIcon, 
  SparkleIcon,
  CheckIcon,
  DownloadIcon,
  PlayIcon
} from '@phosphor-icons/react';
import { WidgetPreview } from './widget-preview';
import { cn } from '@/lib/utils';
import type { AppConfig } from '@/lib/types';
import type { WidgetConfig } from '@/lib/widget-types';

interface WidgetBuilderProps {
  appConfig: AppConfig;
}

const defaultWidgetConfig: WidgetConfig = {
  // Appearance
  theme: 'light',
  primaryColor: '#002cf2',
  backgroundColor: '#ffffff',
  textColor: '#000000',
  borderRadius: 16,
  
  // Layout
  position: 'bottom-right',
  size: 'medium',
  width: 400,
  height: 600,
  
  // Behavior
  autoOpen: false,
  showMinimized: true,
  enableDragging: false,
  
  // Features
  showHeader: true,
  showBranding: true,
  customTitle: '',
  customSubtitle: '',
  
  // Advanced
  customCSS: '',
  zIndex: 1000,
};

const colorPresets = [
  { name: 'LiveKit Blue', color: '#002cf2' },
  { name: 'Ocean', color: '#0ea5e9' },
  { name: 'Emerald', color: '#10b981' },
  { name: 'Purple', color: '#8b5cf6' },
  { name: 'Rose', color: '#f43f5e' },
  { name: 'Orange', color: '#f97316' },
];

export function WidgetBuilder({ appConfig }: WidgetBuilderProps) {
  const [config, setConfig] = useState<WidgetConfig>(defaultWidgetConfig);
  const [activeTab, setActiveTab] = useState('appearance');
  const [showPreview, setShowPreview] = useState(true);
  const [embedCode, setEmbedCode] = useState('');
  const [copied, setCopied] = useState(false);

  const updateConfig = useCallback((updates: Partial<WidgetConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const generateEmbedCode = useCallback(() => {
    const baseUrl = window.location.origin;
    
    const code = `<!-- LiveKit Voice Assistant Widget -->
<div id="livekit-widget-container"></div>
<script>
  (function() {
    var config = ${JSON.stringify(config, null, 2)};
    var iframe = document.createElement('iframe');
    iframe.src = '${baseUrl}/embed?config=' + encodeURIComponent(JSON.stringify(config));
    iframe.style.cssText = [
      'border: none',
      'position: fixed',
      'z-index: ' + config.zIndex,
      'transition: all 0.3s ease'
    ].join('; ');
    
    // Position the widget
    switch(config.position) {
      case 'bottom-right':
        iframe.style.bottom = '20px';
        iframe.style.right = '20px';
        break;
      case 'bottom-left':
        iframe.style.bottom = '20px';
        iframe.style.left = '20px';
        break;
      case 'top-right':
        iframe.style.top = '20px';
        iframe.style.right = '20px';
        break;
      case 'top-left':
        iframe.style.top = '20px';
        iframe.style.left = '20px';
        break;
    }
    
    // Size the widget
    if (config.showMinimized) {
      iframe.style.width = '64px';
      iframe.style.height = '64px';
      iframe.style.borderRadius = '50%';
    } else {
      iframe.style.width = config.width + 'px';
      iframe.style.height = config.height + 'px';
      iframe.style.borderRadius = config.borderRadius + 'px';
    }
    
    document.getElementById('livekit-widget-container').appendChild(iframe);
  })();
</script>`;
    
    setEmbedCode(code);
  }, [config]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const resetToDefaults = () => {
    setConfig(defaultWidgetConfig);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="mx-auto max-w-7xl p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <SparkleIcon size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Widget Builder</h1>
              <p className="text-gray-600">
                Design and customize your LiveKit Voice Assistant widget
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Live Preview
            </Badge>
            <Badge variant="outline">
              {config.width}×{config.height}px
            </Badge>
            <Button variant="outline" size="sm" onClick={resetToDefaults}>
              Reset to Defaults
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
          {/* Configuration Panel */}
          <div className="xl:col-span-1 space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GearIcon size={20} />
                  Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="appearance" className="flex items-center gap-1">
                      <PaletteIcon size={14} />
                      <span className="hidden sm:inline">Style</span>
                    </TabsTrigger>
                    <TabsTrigger value="layout" className="flex items-center gap-1">
                      <LayoutIcon size={14} />
                      <span className="hidden sm:inline">Layout</span>
                    </TabsTrigger>
                    <TabsTrigger value="behavior" className="flex items-center gap-1">
                      <GearIcon size={14} />
                      <span className="hidden sm:inline">Behavior</span>
                    </TabsTrigger>
                    <TabsTrigger value="advanced" className="flex items-center gap-1">
                      <CodeIcon size={14} />
                      <span className="hidden sm:inline">Advanced</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="appearance" className="space-y-6">
                    {/* Theme Selection */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Theme</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['light', 'dark', 'auto'] as const).map((theme) => (
                          <button
                            key={theme}
                            onClick={() => updateConfig({ theme })}
                            className={cn(
                              'p-3 rounded-lg border-2 transition-all text-sm font-medium capitalize',
                              config.theme === theme
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            {theme}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Color Presets */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Color Presets</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.name}
                            onClick={() => updateConfig({ primaryColor: preset.color })}
                            className={cn(
                              'p-2 rounded-lg border-2 transition-all flex items-center gap-2',
                              config.primaryColor === preset.color
                                ? 'border-gray-400'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ backgroundColor: preset.color }}
                            />
                            <span className="text-xs font-medium truncate">{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={config.primaryColor}
                            onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                            className="w-12 h-10 p-1 rounded-lg"
                          />
                          <Input
                            value={config.primaryColor}
                            onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                            placeholder="#002cf2"
                            className="font-mono text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Background</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={config.backgroundColor}
                            onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                            className="w-12 h-10 p-1 rounded-lg"
                          />
                          <Input
                            value={config.backgroundColor}
                            onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                            placeholder="#ffffff"
                            className="font-mono text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Border Radius */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Border Radius</Label>
                        <Badge variant="outline" className="font-mono">
                          {config.borderRadius}px
                        </Badge>
                      </div>
                      <Slider
                        value={[config.borderRadius]}
                        onValueChange={([value]) => updateConfig({ borderRadius: value })}
                        max={32}
                        min={0}
                        step={2}
                        className="mt-2"
                      />
                    </div>

                    {/* Custom Text */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Custom Title</Label>
                        <Input
                          value={config.customTitle}
                          onChange={(e) => updateConfig({ customTitle: e.target.value })}
                          placeholder={appConfig.pageTitle}
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold">Custom Subtitle</Label>
                        <Input
                          value={config.customSubtitle}
                          onChange={(e) => updateConfig({ customSubtitle: e.target.value })}
                          placeholder={appConfig.pageDescription}
                          className="text-sm"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="layout" className="space-y-6">
                    {/* Position */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Position</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'top-left', label: 'Top Left' },
                          { value: 'top-right', label: 'Top Right' },
                          { value: 'bottom-left', label: 'Bottom Left' },
                          { value: 'bottom-right', label: 'Bottom Right' },
                        ].map((position) => (
                          <button
                            key={position.value}
                            onClick={() => updateConfig({ position: position.value as any })}
                            className={cn(
                              'p-3 rounded-lg border-2 transition-all text-sm font-medium',
                              config.position === position.value
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            {position.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Size Presets */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Size Preset</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { value: 'small', label: 'Small', desc: '320×480' },
                          { value: 'medium', label: 'Medium', desc: '400×600' },
                          { value: 'large', label: 'Large', desc: '500×700' },
                        ].map((size) => (
                          <button
                            key={size.value}
                            onClick={() => updateConfig({ size: size.value as any })}
                            className={cn(
                              'p-3 rounded-lg border-2 transition-all text-center',
                              config.size === size.value
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-200 hover:border-gray-300'
                            )}
                          >
                            <div className="font-medium text-sm">{size.label}</div>
                            <div className="text-xs text-gray-500 font-mono">{size.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Custom Dimensions */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold">Width</Label>
                          <Badge variant="outline" className="font-mono">
                            {config.width}px
                          </Badge>
                        </div>
                        <Slider
                          value={[config.width]}
                          onValueChange={([value]) => updateConfig({ width: value })}
                          max={800}
                          min={280}
                          step={20}
                        />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-semibold">Height</Label>
                          <Badge variant="outline" className="font-mono">
                            {config.height}px
                          </Badge>
                        </div>
                        <Slider
                          value={[config.height]}
                          onValueChange={([value]) => updateConfig({ height: value })}
                          max={800}
                          min={400}
                          step={20}
                        />
                      </div>
                    </div>

                    {/* Z-Index */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-semibold">Z-Index</Label>
                        <Badge variant="outline" className="font-mono">
                          {config.zIndex}
                        </Badge>
                      </div>
                      <Slider
                        value={[config.zIndex]}
                        onValueChange={([value]) => updateConfig({ zIndex: value })}
                        max={9999}
                        min={1}
                        step={100}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="behavior" className="space-y-6">
                    {[
                      {
                        key: 'autoOpen',
                        label: 'Auto Open',
                        description: 'Open widget automatically when page loads',
                      },
                      {
                        key: 'showMinimized',
                        label: 'Start Minimized',
                        description: 'Begin in minimized state',
                      },
                      {
                        key: 'enableDragging',
                        label: 'Enable Dragging',
                        description: 'Allow users to drag the widget around',
                      },
                      {
                        key: 'showHeader',
                        label: 'Show Header',
                        description: 'Display widget header with title',
                      },
                      {
                        key: 'showBranding',
                        label: 'Show Branding',
                        description: 'Display "Powered by LiveKit" footer',
                      },
                    ].map((option) => (
                      <div key={option.key} className="flex items-start justify-between p-4 rounded-lg border bg-gray-50/50">
                        <div className="flex-1">
                          <Label className="text-sm font-semibold">{option.label}</Label>
                          <p className="text-xs text-gray-600 mt-1">{option.description}</p>
                        </div>
                        <Switch
                          checked={config[option.key as keyof WidgetConfig] as boolean}
                          onCheckedChange={(checked) => updateConfig({ [option.key]: checked })}
                        />
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6">
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Custom CSS</Label>
                      <Textarea
                        value={config.customCSS}
                        onChange={(e) => updateConfig({ customCSS: e.target.value })}
                        placeholder={`/* Custom styles for your widget */
.widget-container {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.widget-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}`}
                        rows={12}
                        className="font-mono text-sm resize-none"
                      />
                      <p className="text-xs text-gray-500">
                        Add custom CSS to further customize your widget appearance
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Generate Embed Code */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <CodeIcon size={20} />
                  Embed Code
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={generateEmbedCode} className="w-full" size="lg">
                  <PlayIcon size={16} />
                  Generate Embed Code
                </Button>
                
                {embedCode && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">HTML Embed Code</Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(embedCode)}
                          className="flex items-center gap-1"
                        >
                          {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                          {copied ? 'Copied!' : 'Copy'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const blob = new Blob([embedCode], { type: 'text/html' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = 'livekit-widget-embed.html';
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                        >
                          <DownloadIcon size={14} />
                          Download
                        </Button>
                      </div>
                    </div>
                    <Textarea
                      value={embedCode}
                      readOnly
                      rows={8}
                      className="font-mono text-xs bg-gray-50 resize-none"
                    />
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-sm text-blue-800">
                        <strong>Instructions:</strong> Copy this code and paste it into your website's HTML 
                        where you want the widget to appear. The widget will automatically position itself 
                        according to your configuration.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="xl:col-span-2">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm h-fit">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <EyeIcon size={20} />
                    Live Preview
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live
                    </div>
                    <Switch
                      checked={showPreview}
                      onCheckedChange={setShowPreview}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showPreview && (
                  <div className="relative min-h-[700px] bg-gradient-to-br from-gray-100 via-gray-50 to-white rounded-xl overflow-hidden border-2 border-gray-200 shadow-inner">
                    <WidgetPreview config={config} appConfig={appConfig} />
                    
                    {/* Debug info for widget visibility */}
                    <div className="absolute bottom-4 left-4 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-mono opacity-75">
                      Widget: {config.showMinimized ? 'Minimized' : 'Expanded'} | 
                      Theme: {config.theme} | 
                      Z-Index: {config.zIndex}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
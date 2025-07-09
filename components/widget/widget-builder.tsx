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
import { CopyIcon, EyeIcon, CodeIcon } from '@phosphor-icons/react';
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
  borderRadius: 12,
  
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

export function WidgetBuilder({ appConfig }: WidgetBuilderProps) {
  const [config, setConfig] = useState<WidgetConfig>(defaultWidgetConfig);
  const [activeTab, setActiveTab] = useState('appearance');
  const [showPreview, setShowPreview] = useState(true);
  const [embedCode, setEmbedCode] = useState('');

  const updateConfig = useCallback((updates: Partial<WidgetConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const generateEmbedCode = useCallback(() => {
    const baseUrl = window.location.origin;
    const configParam = encodeURIComponent(JSON.stringify(config));
    
    const code = `<!-- LiveKit Voice Assistant Widget -->
<div id="livekit-widget"></div>
<script>
  (function() {
    var config = ${JSON.stringify(config, null, 2)};
    var iframe = document.createElement('iframe');
    iframe.src = '${baseUrl}/embed?config=' + encodeURIComponent(JSON.stringify(config));
    iframe.style.cssText = 'border: none; position: fixed; z-index: ' + config.zIndex + ';';
    
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
      iframe.style.width = '60px';
      iframe.style.height = '60px';
    } else {
      iframe.style.width = config.width + 'px';
      iframe.style.height = config.height + 'px';
    }
    
    document.getElementById('livekit-widget').appendChild(iframe);
  })();
</script>`;
    
    setEmbedCode(code);
  }, [config]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Widget Builder</h1>
          <p className="mt-2 text-gray-600">
            Customize and embed your LiveKit Voice Assistant widget
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Configuration Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CodeIcon size={20} />
                  Widget Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="appearance">Style</TabsTrigger>
                    <TabsTrigger value="layout">Layout</TabsTrigger>
                    <TabsTrigger value="behavior">Behavior</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>

                  <TabsContent value="appearance" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="theme">Theme</Label>
                        <Select value={config.theme} onValueChange={(value: 'light' | 'dark' | 'auto') => updateConfig({ theme: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="auto">Auto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="size">Size</Label>
                        <Select value={config.size} onValueChange={(value: 'small' | 'medium' | 'large') => updateConfig({ size: value })}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="primaryColor">Primary Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={config.primaryColor}
                            onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            value={config.primaryColor}
                            onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                            placeholder="#002cf2"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="backgroundColor">Background Color</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={config.backgroundColor}
                            onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                            className="w-16 h-10 p-1"
                          />
                          <Input
                            value={config.backgroundColor}
                            onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="borderRadius">Border Radius: {config.borderRadius}px</Label>
                      <Slider
                        value={[config.borderRadius]}
                        onValueChange={([value]) => updateConfig({ borderRadius: value })}
                        max={24}
                        min={0}
                        step={1}
                        className="mt-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customTitle">Custom Title</Label>
                      <Input
                        value={config.customTitle}
                        onChange={(e) => updateConfig({ customTitle: e.target.value })}
                        placeholder="Leave empty to use default"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="customSubtitle">Custom Subtitle</Label>
                      <Input
                        value={config.customSubtitle}
                        onChange={(e) => updateConfig({ customSubtitle: e.target.value })}
                        placeholder="Leave empty to use default"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="layout" className="space-y-4">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Select value={config.position} onValueChange={(value: any) => updateConfig({ position: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bottom-right">Bottom Right</SelectItem>
                          <SelectItem value="bottom-left">Bottom Left</SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="top-left">Top Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="width">Width: {config.width}px</Label>
                        <Slider
                          value={[config.width]}
                          onValueChange={([value]) => updateConfig({ width: value })}
                          max={800}
                          min={300}
                          step={10}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height: {config.height}px</Label>
                        <Slider
                          value={[config.height]}
                          onValueChange={([value]) => updateConfig({ height: value })}
                          max={800}
                          min={400}
                          step={10}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="zIndex">Z-Index: {config.zIndex}</Label>
                      <Slider
                        value={[config.zIndex]}
                        onValueChange={([value]) => updateConfig({ zIndex: value })}
                        max={9999}
                        min={1}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="behavior" className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="autoOpen">Auto Open</Label>
                        <p className="text-sm text-gray-500">Open widget automatically on page load</p>
                      </div>
                      <Switch
                        checked={config.autoOpen}
                        onCheckedChange={(checked) => updateConfig({ autoOpen: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showMinimized">Show Minimized</Label>
                        <p className="text-sm text-gray-500">Start in minimized state</p>
                      </div>
                      <Switch
                        checked={config.showMinimized}
                        onCheckedChange={(checked) => updateConfig({ showMinimized: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="enableDragging">Enable Dragging</Label>
                        <p className="text-sm text-gray-500">Allow users to drag the widget</p>
                      </div>
                      <Switch
                        checked={config.enableDragging}
                        onCheckedChange={(checked) => updateConfig({ enableDragging: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showHeader">Show Header</Label>
                        <p className="text-sm text-gray-500">Display widget header with title</p>
                      </div>
                      <Switch
                        checked={config.showHeader}
                        onCheckedChange={(checked) => updateConfig({ showHeader: checked })}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="showBranding">Show Branding</Label>
                        <p className="text-sm text-gray-500">Display "Powered by LiveKit" branding</p>
                      </div>
                      <Switch
                        checked={config.showBranding}
                        onCheckedChange={(checked) => updateConfig({ showBranding: checked })}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-4">
                    <div>
                      <Label htmlFor="customCSS">Custom CSS</Label>
                      <Textarea
                        value={config.customCSS}
                        onChange={(e) => updateConfig({ customCSS: e.target.value })}
                        placeholder="/* Add your custom CSS here */"
                        rows={8}
                        className="font-mono text-sm"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Generate Embed Code */}
            <Card>
              <CardHeader>
                <CardTitle>Embed Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={generateEmbedCode} className="w-full">
                  Generate Embed Code
                </Button>
                
                {embedCode && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>HTML Embed Code</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(embedCode)}
                      >
                        <CopyIcon size={16} />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={embedCode}
                      readOnly
                      rows={12}
                      className="font-mono text-xs"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <EyeIcon size={20} />
                    Live Preview
                  </span>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {config.width}×{config.height}
                    </Badge>
                    <Switch
                      checked={showPreview}
                      onCheckedChange={setShowPreview}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {showPreview && (
                  <div className="relative min-h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                    <WidgetPreview config={config} appConfig={appConfig} />
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
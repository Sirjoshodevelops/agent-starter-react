export interface WidgetConfig {
  // Appearance
  theme: 'light' | 'dark' | 'auto';
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  borderRadius: number;
  
  // Layout
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size: 'small' | 'medium' | 'large';
  width: number;
  height: number;
  
  // Behavior
  autoOpen: boolean;
  showMinimized: boolean;
  enableDragging: boolean;
  
  // Features
  showHeader: boolean;
  showBranding: boolean;
  customTitle: string;
  customSubtitle: string;
  
  // Advanced
  customCSS: string;
  zIndex: number;
}
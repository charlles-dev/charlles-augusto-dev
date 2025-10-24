import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Palette, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
}

const defaultScheme: ColorScheme = {
  primary: '158 64% 52%',
  secondary: '214 100% 59%',
  accent: '158 64% 52%',
  background: '219 33% 9%',
  foreground: '210 40% 98%'
};

const presets = [
  {
    name: 'Emerald Tech (Default)',
    colors: defaultScheme
  },
  {
    name: 'Purple Dream',
    colors: {
      primary: '271 81% 56%',
      secondary: '280 100% 70%',
      accent: '271 81% 56%',
      background: '240 10% 3.9%',
      foreground: '0 0% 98%'
    }
  },
  {
    name: 'Ocean Blue',
    colors: {
      primary: '199 89% 48%',
      secondary: '217 91% 60%',
      accent: '199 89% 48%',
      background: '222 47% 11%',
      foreground: '210 40% 98%'
    }
  },
  {
    name: 'Sunset Orange',
    colors: {
      primary: '24 100% 50%',
      secondary: '45 100% 51%',
      accent: '24 100% 50%',
      background: '20 14% 4%',
      foreground: '60 9% 98%'
    }
  },
  {
    name: 'Rose Pink',
    colors: {
      primary: '346 77% 50%',
      secondary: '336 100% 67%',
      accent: '346 77% 50%',
      background: '240 5% 6%',
      foreground: '0 0% 98%'
    }
  }
];

export const ThemeCustomizer = () => {
  const [customColors, setCustomColors] = useState<ColorScheme>(() => {
    const saved = localStorage.getItem('custom-theme');
    return saved ? JSON.parse(saved) : defaultScheme;
  });

  const applyColors = (colors: ColorScheme) => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
    localStorage.setItem('custom-theme', JSON.stringify(colors));
    setCustomColors(colors);
    toast.success('Theme applied successfully!');
  };

  const resetToDefault = () => {
    applyColors(defaultScheme);
    toast.info('Theme reset to default');
  };

  const handleColorChange = (key: keyof ColorScheme, value: string) => {
    const newColors = { ...customColors, [key]: value };
    setCustomColors(newColors);
  };

  useEffect(() => {
    // Apply saved theme on mount
    applyColors(customColors);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <CardTitle>Theme Customizer</CardTitle>
          </div>
          <Button variant="outline" size="sm" onClick={resetToDefault}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>
        <CardDescription>
          Customize your portfolio's color scheme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="presets" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="presets">Presets</TabsTrigger>
            <TabsTrigger value="custom">Custom Colors</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {presets.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  className="h-auto py-4 flex-col items-start gap-2"
                  onClick={() => applyColors(preset.colors)}
                >
                  <div className="font-medium">{preset.name}</div>
                  <div className="flex gap-2">
                    {Object.entries(preset.colors).slice(0, 3).map(([key, value]) => (
                      <div
                        key={key}
                        className="w-8 h-8 rounded-full border-2 border-border"
                        style={{ backgroundColor: `hsl(${value})` }}
                      />
                    ))}
                  </div>
                </Button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="space-y-4">
              {Object.entries(customColors).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id={key}
                      value={value}
                      onChange={(e) => handleColorChange(key as keyof ColorScheme, e.target.value)}
                      placeholder="e.g., 158 64% 52%"
                      className="flex-1"
                    />
                    <div
                      className="w-12 h-10 rounded border-2 border-border"
                      style={{ backgroundColor: `hsl(${value})` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Format: H S% L% (e.g., 158 64% 52%)
                  </p>
                </div>
              ))}
              <Button onClick={() => applyColors(customColors)} className="w-full">
                Apply Custom Colors
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

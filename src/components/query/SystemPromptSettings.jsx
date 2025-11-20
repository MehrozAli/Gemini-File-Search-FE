'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

const SYSTEM_PROMPT_KEY = 'fileSearch_systemPrompt';

export function SystemPromptSettings() {
  const [systemPrompt, setSystemPrompt] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load system prompt from localStorage
    const saved = localStorage.getItem(SYSTEM_PROMPT_KEY);
    if (saved) {
      setSystemPrompt(saved);
      setIsSaved(true);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(SYSTEM_PROMPT_KEY, systemPrompt);
    setIsSaved(true);
    toast.success('System prompt saved!');
  };

  const handleClear = () => {
    localStorage.removeItem(SYSTEM_PROMPT_KEY);
    setSystemPrompt('');
    setIsSaved(false);
    toast.success('System prompt cleared!');
  };

  const handleChange = (value) => {
    setSystemPrompt(value);
    setIsSaved(false);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <CardTitle className="text-base">System Prompt</CardTitle>
                {isSaved && !isOpen && (
                  <span className="text-xs text-muted-foreground">✓ Active</span>
                )}
              </div>
              {isOpen ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            {!isOpen && (
              <CardDescription className="text-xs">
                Click to {isSaved ? 'edit' : 'set'} custom system prompt
              </CardDescription>
            )}
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4 pt-0">
            <CardDescription className="text-sm">
              Set a custom system prompt that will be used with all queries. This helps guide the AI's behavior and responses.
            </CardDescription>

            <div className="space-y-2">
              <Label htmlFor="system-prompt">Prompt</Label>
              <Textarea
                id="system-prompt"
                placeholder="You are a helpful assistant that summarizes documents concisely..."
                value={systemPrompt}
                onChange={(e) => handleChange(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground">
                {systemPrompt.length} characters
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaved && systemPrompt === localStorage.getItem(SYSTEM_PROMPT_KEY)}>
                <Save className="h-4 w-4 mr-2" />
                {isSaved ? 'Saved' : 'Save'}
              </Button>
              {systemPrompt && (
                <Button variant="outline" onClick={handleClear}>
                  Clear
                </Button>
              )}
            </div>

            {isSaved && (
              <p className="text-xs text-muted-foreground">
                ✓ This prompt will be included with all your queries
              </p>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}

// Helper function to get the saved system prompt
export function getSavedSystemPrompt() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SYSTEM_PROMPT_KEY) || '';
  }
  return '';
}

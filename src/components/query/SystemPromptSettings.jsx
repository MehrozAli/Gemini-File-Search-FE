'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Save, Settings, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

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
    setIsOpen(false);
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          <span>System Prompt</span>
          {isSaved && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              Active
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Prompt
          </DialogTitle>
          <DialogDescription>
            Set a custom system prompt to guide the AI&apos;s behavior and responses for all queries.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="system-prompt">Custom Prompt</Label>
            <Textarea
              id="system-prompt"
              placeholder="You are a helpful assistant that summarizes documents concisely..."
              value={systemPrompt}
              onChange={(e) => handleChange(e.target.value)}
              className="min-h-[150px] resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {systemPrompt.length} characters
            </p>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={isSaved && systemPrompt === localStorage.getItem(SYSTEM_PROMPT_KEY)}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaved ? 'Saved' : 'Save Prompt'}
            </Button>
            {systemPrompt && (
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            )}
          </div>

          {isSaved && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-md">
              <Badge variant="secondary" className="h-5">✓</Badge>
              This prompt will be included with all your queries
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to get the saved system prompt
export function getSavedSystemPrompt() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SYSTEM_PROMPT_KEY) || '';
  }
  return '';
}

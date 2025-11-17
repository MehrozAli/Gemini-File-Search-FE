'use client';

import { useState } from 'react';
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
import { saveSystemPrompt, useSavedSystemPrompt } from '@/lib/systemPrompt';

export function SystemPromptSettings() {
  const savedPrompt = useSavedSystemPrompt();
  const [draft, setDraft] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenChange = (open) => {
    if (open) setDraft(savedPrompt);
    setIsOpen(open);
  };

  const handleSave = () => {
    saveSystemPrompt(draft);
    toast.success('System prompt saved!');
    setIsOpen(false);
  };

  const handleClear = () => {
    saveSystemPrompt('');
    setDraft('');
    toast.success('System prompt cleared!');
  };

  const isSaved = draft === savedPrompt;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Sparkles className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only">System Prompt</span>
          {savedPrompt && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              Active
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Prompt
          </DialogTitle>
          <DialogDescription>
            Set a custom system prompt to guide the AI&apos;s behavior and responses for all queries.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-4 py-4 pr-2">
          <div className="space-y-2">
            <Label htmlFor="system-prompt">Custom Prompt</Label>
            <Textarea
              id="system-prompt"
              placeholder="You are a helpful assistant that summarizes documents concisely..."
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="min-h-[200px] max-h-[400px] resize-y"
            />
            <p className="text-xs text-muted-foreground">
              {draft.length} characters
            </p>
          </div>
        </div>

        <div className="shrink-0 flex gap-2 pt-4 border-t">
          <Button onClick={handleSave} disabled={isSaved} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            {isSaved ? 'Saved' : 'Save Prompt'}
          </Button>
          {draft && (
            <Button variant="outline" onClick={handleClear}>
              Clear
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

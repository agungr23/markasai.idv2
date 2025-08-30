'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Code,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Tulis konten artikel...",
  rows = 20,
  className = ""
}: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertText = (before: string, after: string = '', placeholder: string = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newText = value.substring(0, start) + before + textToInsert + after + value.substring(end);
    onChange(newText);

    // Set cursor position after insertion
    setTimeout(() => {
      const newCursorPos = start + before.length + textToInsert.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
      textarea.focus();
    }, 0);
  };

  const insertAtCursor = (text: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
    const newText = value.substring(0, start) + text + value.substring(end);
    onChange(newText);

    setTimeout(() => {
      textarea.setSelectionRange(start + text.length, start + text.length);
      textarea.focus();
    }, 0);
  };

  const formatMarkdown = (text: string) => {
    return text
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mb-4">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-2xl font-bold mb-3">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mb-2">$1</h3>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600">$1</blockquote>')
      .replace(/^\* (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^1\. (.*$)/gm, '<li class="ml-4">1. $1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank">$1</a>');
  };

  const toolbarButtons = [
    {
      icon: Heading1,
      label: 'Heading 1',
      action: () => insertAtCursor('# '),
      shortcut: 'Ctrl+1'
    },
    {
      icon: Heading2,
      label: 'Heading 2', 
      action: () => insertAtCursor('## '),
      shortcut: 'Ctrl+2'
    },
    {
      icon: Heading3,
      label: 'Heading 3',
      action: () => insertAtCursor('### '),
      shortcut: 'Ctrl+3'
    },
    {
      icon: Bold,
      label: 'Bold',
      action: () => insertText('**', '**', 'bold text'),
      shortcut: 'Ctrl+B'
    },
    {
      icon: Italic,
      label: 'Italic',
      action: () => insertText('*', '*', 'italic text'),
      shortcut: 'Ctrl+I'
    },
    {
      icon: Underline,
      label: 'Underline',
      action: () => insertText('__', '__', 'underlined text'),
      shortcut: 'Ctrl+U'
    },
    {
      icon: Code,
      label: 'Inline Code',
      action: () => insertText('`', '`', 'code'),
      shortcut: 'Ctrl+`'
    },
    {
      icon: Quote,
      label: 'Quote',
      action: () => insertAtCursor('> '),
      shortcut: 'Ctrl+Q'
    },
    {
      icon: List,
      label: 'Bullet List',
      action: () => insertAtCursor('* '),
      shortcut: 'Ctrl+L'
    },
    {
      icon: ListOrdered,
      label: 'Numbered List',
      action: () => insertAtCursor('1. '),
      shortcut: 'Ctrl+Shift+L'
    },
    {
      icon: Link,
      label: 'Link',
      action: () => insertText('[', '](url)', 'link text'),
      shortcut: 'Ctrl+K'
    },
    {
      icon: Image,
      label: 'Image',
      action: () => insertText('![', '](image-url)', 'alt text'),
      shortcut: 'Ctrl+Shift+I'
    }
  ];

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-2 border-b bg-gray-50">
        <div className="flex items-center gap-1 flex-wrap">
          {toolbarButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <Button
                key={index}
                type="button"
                variant="ghost"
                size="sm"
                onClick={button.action}
                title={`${button.label} (${button.shortcut})`}
                className="h-8 w-8 p-0"
              >
                <Icon className="w-4 h-4" />
              </Button>
            );
          })}
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            Markdown
          </Badge>
        </div>
      </div>

      {/* Editor */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full border-0 resize-none focus:outline-none focus:ring-0 font-mono text-sm p-4 min-h-[400px]"
        />
      </div>

      {/* Help Text */}
      <div className="p-2 border-t bg-gray-50 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span>
            Gunakan Markdown untuk formatting. Klik tombol toolbar atau gunakan keyboard shortcuts.
          </span>
          <span className="text-gray-400">
            {value.length} characters • {Math.ceil(value.split(' ').length / 200)} min read
          </span>
        </div>
      </div>
    </div>
  );
}

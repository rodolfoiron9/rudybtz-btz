'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '@/lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Bot, Loader2, Send, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { chat } from '@/ai/flows/chat-flow';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when messages change
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { id: `user-${Date.now()}`, role: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const assistantMessageText = await chat(input);
      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: assistantMessageText,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        text: 'Sorry, I encountered an error. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl h-[70vh] flex flex-col glassmorphism bg-card/80">
        <CardHeader className='text-center'>
            <div className="flex justify-center mb-2">
                <div className="p-3 rounded-full bg-primary/20">
                    <Bot className="w-8 h-8 text-primary" />
                </div>
            </div>
            <CardTitle className="text-2xl font-black tracking-wider uppercase font-headline">AI Fan Chat</CardTitle>
            <CardDescription>Chat with an AI trained on RUDYBTZ's world.</CardDescription>
        </CardHeader>
      <CardContent className="flex-grow flex flex-col p-4">
        <ScrollArea className="flex-grow p-4 border rounded-lg bg-background/30" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <div className="p-2 rounded-full bg-accent/20">
                    <Bot className="w-5 h-5 text-accent" />
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-xs md:max-w-md p-3 rounded-xl',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                {message.role === 'user' && (
                   <div className="p-2 rounded-full bg-foreground/10">
                    <User className="w-5 h-5 text-foreground" />
                  </div>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                 <div className="p-2 rounded-full bg-accent/20">
                    <Bot className="w-5 h-5 text-accent" />
                  </div>
                <div className="max-w-xs md:max-w-md p-3 rounded-xl bg-muted text-muted-foreground">
                    <Loader2 className="w-5 h-5 animate-spin"/>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2 pt-4">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask something about RUDYBTZ..."
            className="flex-grow h-12"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" className="w-12 h-12" disabled={isLoading}>
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Music, 
  Brain,
  Save,
  RefreshCw,
  Sparkles,
  Volume2
} from 'lucide-react';

interface Track {
  id: string;
  title: string;
  duration: number;
  lyrics?: string;
}

interface Album {
  id: string;
  title: string;
  genre: string;
  mood?: string;
  description?: string;
}

interface TrackLyricsManagerProps {
  track: Track;
  album?: Album;
  onUpdateTrack?: (trackId: string, updates: Partial<Track>) => void;
}

export function TrackLyricsManager({ track, album, onUpdateTrack }: TrackLyricsManagerProps) {
  const [lyrics, setLyrics] = useState(track.lyrics || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
  const [showOptions, setShowOptions] = useState(false);

  const generateAIPrompt = () => {
    const prompt = `Song: "${track.title}"`;
    const albumInfo = album ? `\nAlbum: "${album.title}" (${album.genre})` : '';
    const moodInfo = album?.mood ? `\nMood: ${album.mood}` : '';
    const descInfo = album?.description ? `\nContext: ${album.description}` : '';
    
    return prompt + albumInfo + moodInfo + descInfo;
  };

  const handleGenerateLyrics = async () => {
    setIsGenerating(true);
    setShowOptions(false);
    
    try {
      // Simulate AI lyrics generation
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const prompt = generateAIPrompt();
      
      // Mock generated lyrics options
      const options = [
        generateMockLyrics('verse-chorus', track.title, album?.mood || 'emotional'),
        generateMockLyrics('storytelling', track.title, album?.mood || 'reflective'),
        generateMockLyrics('abstract', track.title, album?.mood || 'energetic')
      ];
      
      setGeneratedOptions(options);
      setShowOptions(true);
    } catch (error) {
      console.error('Failed to generate lyrics:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateMockLyrics = (style: string, title: string, mood: string): string => {
    const verses = {
      'verse-chorus': `[Verse 1]
Walking through the ${mood} night
${title} calls my name
Every step feels so right
Nothing will ever be the same

[Chorus]
${title}, ${title}
Take me to a place unknown
${title}, ${title}
Where I can call my own

[Verse 2]
Memories fade like morning mist
But this feeling stays so strong
In this moment, I exist
This is where I belong

[Chorus]
${title}, ${title}
Take me to a place unknown
${title}, ${title}
Where I can call my own

[Bridge]
Time keeps moving forward
But I'm standing still
${title} whispers softly
"Follow your own will"

[Outro]
${title}, you're my guide
Through the ${mood} tide`,

      'storytelling': `[Verse 1]
There was a time when ${title} meant everything
A ${mood} story waiting to unfold
Through the seasons of remembering
A tale that's never been told

[Verse 2]
She walked into the room that day
With ${title} written in her eyes
The world around us faded away
Beneath those starlit skies

[Verse 3]
Years have passed since that moment
When ${title} changed our lives
The ${mood} feelings, still potent
As the memory survives

[Verse 4]
Now when I hear that name again
${title} echoes in my heart
Through all the joy and all the pain
We never truly part`,

      'abstract': `[Verse 1]
${title} flows like liquid dreams
Through corridors of ${mood} light
Nothing is quite what it seems
In this kaleidoscope of sight

[Verse 2]
Fractured thoughts and whispered words
${title} dances in the air
Like a symphony of birds
Singing secrets everywhere

[Verse 3]
Colors bleeding into sound
${mood} waves crash against my mind
In this space where we are found
Leaving logic far behind

[Verse 4]
${title} is the key that opens doors
To realms beyond our understanding
Where the ${mood} spirit soars
In eternal free-standing`
    };

    return verses[style as keyof typeof verses] || verses['verse-chorus'];
  };

  const handleSelectLyrics = (selectedLyrics: string) => {
    setLyrics(selectedLyrics);
    setShowOptions(false);
  };

  const handleSave = () => {
    onUpdateTrack?.(track.id, { lyrics });
  };

  const hasUnsavedChanges = lyrics !== (track.lyrics || '');

  return (
    <div className="space-y-4">
      <Card className="cyber-card">
        <CardHeader>
          <CardTitle className="text-3d-silver-violet silver-violet flex items-center gap-2">
            <Music className="w-5 h-5" />
            Track Lyrics: {track.title}
          </CardTitle>
          <CardDescription className="text-muted">
            Add or generate lyrics for this track using AI assistance
          </CardDescription>
          {album && (
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-violet-300 border-violet-400/30">
                <Volume2 className="w-3 h-3 mr-1" />
                {album.title}
              </Badge>
              <Badge variant="outline" className="text-blue-300 border-blue-400/30">
                {album.genre}
              </Badge>
              {album.mood && (
                <Badge variant="outline" className="text-purple-300 border-purple-400/30">
                  {album.mood}
                </Badge>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="lyrics">Lyrics</Label>
              <Button 
                onClick={handleGenerateLyrics}
                disabled={isGenerating}
                size="sm"
                className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
            
            <Textarea
              id="lyrics"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Enter song lyrics here..."
              className="dark-input min-h-[300px] font-mono text-sm leading-relaxed"
              rows={15}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave}
              className="bg-violet-600 hover:bg-violet-700 text-white"
              disabled={!hasUnsavedChanges}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Lyrics
            </Button>
            {hasUnsavedChanges && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                Unsaved changes
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* AI Generated Options */}
      {showOptions && generatedOptions.length > 0 && (
        <Card className="cyber-card border-purple-600/30">
          <CardHeader>
            <CardTitle className="text-purple-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI Generated Lyrics Options
            </CardTitle>
            <CardDescription className="text-muted">
              Choose from the AI-generated options below or use them as inspiration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {generatedOptions.map((option, index) => (
              <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                <div className="flex items-center justify-between mb-3">
                  <Badge variant="outline" className="text-purple-300 border-purple-400/30">
                    Option {index + 1}
                  </Badge>
                  <Button 
                    size="sm"
                    onClick={() => handleSelectLyrics(option)}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Use This
                  </Button>
                </div>
                <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed max-h-[200px] overflow-y-auto">
                  {option}
                </pre>
              </div>
            ))}
            
            <div className="flex gap-2 justify-center pt-2">
              <Button 
                onClick={() => setShowOptions(false)}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Close Options
              </Button>
              <Button 
                onClick={handleGenerateLyrics}
                variant="outline"
                className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-black"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Generate New Options
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Prompt Preview */}
      {isGenerating && (
        <Card className="cyber-card border-blue-600/30">
          <CardHeader>
            <CardTitle className="text-blue-300 flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Analysis Context
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-600/30">
              <pre className="text-sm text-blue-200 whitespace-pre-wrap font-mono">
                {generateAIPrompt()}
              </pre>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              The AI will use this context to generate appropriate lyrics for your track
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
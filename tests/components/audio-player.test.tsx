import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AudioPlayer from '@/components/audio-player';

// Mock the HTMLMediaElement for testing
vi.spyOn(window.HTMLMediaElement.prototype, 'play').mockImplementation(() => Promise.resolve());
vi.spyOn(window.HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});

describe('AudioPlayer Component', () => {
  it('should render with provided src and title', () => {
    render(<AudioPlayer src="/test-audio.mp3" title="Test Audio" />);
    expect(screen.getByText('Test Audio')).toBeInTheDocument();
    const playButton = screen.getByRole('button', { name: /play audio/i });
    expect(playButton).toBeInTheDocument();
  });

  it('should display a message when no src is provided', () => {
    render(<AudioPlayer />);
    expect(screen.getByText('No audio source provided')).toBeInTheDocument();
  });

  it('should toggle play/pause when the button is clicked', async () => {
    render(<AudioPlayer src="/test-audio.mp3" title="Test Audio" />);
    const playButton = screen.getByRole('button', { name: /play audio/i });

    // Initial state is paused
    expect(screen.queryByRole('button', { name: /pause audio/i })).toBeNull();

    // Click to play
    fireEvent.click(playButton);
    const pauseButton = await screen.findByRole('button', { name: /pause audio/i });
    expect(pauseButton).toBeInTheDocument();

    // Click to pause
    fireEvent.click(pauseButton);
    const newPlayButton = await screen.findByRole('button', { name: /play audio/i });
    expect(newPlayButton).toBeInTheDocument();
  });

  it('should toggle mute/unmute when the volume button is clicked', async () => {
    render(<AudioPlayer src="/test-audio.mp3" title="Test Audio" />);
    const muteButton = screen.getByRole('button', { name: /mute audio/i });

    // Initial state is unmuted
    expect(screen.queryByRole('button', { name: /unmute audio/i })).toBeNull();

    // Click to mute
    fireEvent.click(muteButton);
    const unmuteButton = await screen.findByRole('button', { name: /unmute audio/i });
    expect(unmuteButton).toBeInTheDocument();

    // Click to unmute
    fireEvent.click(unmuteButton);
    const newMuteButton = await screen.findByRole('button', { name: /mute audio/i });
    expect(newMuteButton).toBeInTheDocument();
  });
});

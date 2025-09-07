import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AlbumShowcase from '@/components/album-showcase';

// Mock the next/image component
vi.mock('next/image', () => ({
  default: (props: any) => <img {...props} />
}));

describe('AlbumShowcase Component', () => {
  it('should render the discography title and albums', () => {
    render(<AlbumShowcase />);
    expect(screen.getByText('Discography')).toBeInTheDocument();

    // Check if album titles are rendered
    expect(screen.getByText('Neon Horizons')).toBeInTheDocument();
    expect(screen.getByText('Quantum Beats')).toBeInTheDocument();
    expect(screen.getByText('Synthwave Odyssey')).toBeInTheDocument();
  });

  it('should render tracklists for each album', () => {
    render(<AlbumShowcase />);

    // Check for tracks in the first album
    expect(screen.getByText('Digital Dreams')).toBeInTheDocument();
    expect(screen.getByText('Cyber City')).toBeInTheDocument();
  });

  it('should not play a track without a URL', () => {
    render(<AlbumShowcase />);

    // Get a track that has no URL
    const trackWithoutUrl = screen.getByText('Digital Dreams');
    fireEvent.click(trackWithoutUrl);

    // The play button should not change to a pause button
    const playButton = trackWithoutUrl.parentElement?.parentElement?.querySelector('button');
    expect(playButton?.innerHTML).not.toContain('Pause');
  });
});

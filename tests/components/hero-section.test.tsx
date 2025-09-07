import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import HeroSection from '@/components/hero-section';

describe('HeroSection Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the main heading and the first slide', () => {
    render(<HeroSection />);
    expect(screen.getByRole('heading', { name: /RUDYBTZ/i })).toBeInTheDocument();
    expect(screen.getByText('Electronic Dreams')).toBeInTheDocument();
    expect(screen.getByText('Immersive audio experiences')).toBeInTheDocument();
  });

  it('should automatically change slides', () => {
    render(<HeroSection />);
    expect(screen.getByText('Electronic Dreams')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(screen.getByText('Sound Waves')).toBeInTheDocument();
    expect(screen.getByText('Where technology meets artistry')).toBeInTheDocument();
  });

  it('should pause and play the slideshow', () => {
    render(<HeroSection />);
    const pauseButton = screen.getByRole('button', { name: /pause slideshow/i });
    fireEvent.click(pauseButton);

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    // Slide should not have changed
    expect(screen.getByText('Electronic Dreams')).toBeInTheDocument();

    const playButton = screen.getByRole('button', { name: /play slideshow/i });
    fireEvent.click(playButton);

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    // Slide should have changed
    expect(screen.getByText('Sound Waves')).toBeInTheDocument();
  });

  it('should navigate to a slide using indicators', () => {
    render(<HeroSection />);
    const slideIndicators = screen.getAllByRole('button', { name: '' });

    // The play/pause button is also a button, so we need to filter it out.
    // The slide indicators are the last 3 buttons
    const thirdSlideIndicator = slideIndicators[slideIndicators.length - 1];

    fireEvent.click(thirdSlideIndicator);

    expect(screen.getByText('Future Bass')).toBeInTheDocument();
    expect(screen.getByText('Next generation music production')).toBeInTheDocument();
  });
});

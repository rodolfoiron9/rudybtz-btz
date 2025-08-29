/**
 * Audio Analysis Engine
 * Core Web Audio API wrapper for comprehensive audio analysis and visualization
 */

export interface AudioAnalysisConfig {
  fftSize: number;
  smoothingTimeConstant: number;
  minDecibels: number;
  maxDecibels: number;
  sampleRate: number;
}

export interface AudioMetadata {
  duration: number;
  bitRate?: number;
  sampleRate: number;
  channels: number;
  format: string;
  title?: string;
  artist?: string;
  album?: string;
}

export interface FrequencyData {
  frequencies: Uint8Array;
  waveform: Uint8Array;
  frequencyBinData: Uint8Array;
  frequencyFloatData: Float32Array;
  peak: number;
  rms: number;
  timestamp: number;
}

export interface BeatData {
  bpm: number;
  beats: number[];
  confidence: number;
}

export class AudioAnalysisEngine {
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private source: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private audioBuffer: AudioBuffer | null = null;
  private isInitialized = false;
  private isPlaying = false;
  private startTime = 0;
  private pauseTime = 0;
  private config: AudioAnalysisConfig;

  // Analysis data arrays
  private frequencyData: Uint8Array;
  private waveformData: Uint8Array;
  private rawFrequencyData: Float32Array;

  // Beat detection
  private beatDetectionBuffer: number[] = [];
  private lastBeatTime = 0;
  private bpmHistory: number[] = [];

  constructor(config: Partial<AudioAnalysisConfig> = {}) {
    this.config = {
      fftSize: 2048,
      smoothingTimeConstant: 0.8,
      minDecibels: -90,
      maxDecibels: -10,
      sampleRate: 44100,
      ...config
    };

    this.frequencyData = new Uint8Array(new ArrayBuffer(this.config.fftSize / 2));
    this.waveformData = new Uint8Array(new ArrayBuffer(this.config.fftSize));
    this.rawFrequencyData = new Float32Array(new ArrayBuffer(this.config.fftSize / 2 * 4));
  }

  /**
   * Initialize the audio context and analysis nodes
   */
  async initialize(): Promise<void> {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create analyser node
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = this.config.fftSize;
      this.analyser.smoothingTimeConstant = this.config.smoothingTimeConstant;
      this.analyser.minDecibels = this.config.minDecibels;
      this.analyser.maxDecibels = this.config.maxDecibels;

      // Create gain node for volume control
      this.gainNode = this.audioContext.createGain();
      
      // Connect nodes
      this.gainNode.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize audio analysis engine:', error);
      throw new Error('Audio initialization failed');
    }
  }

  /**
   * Load audio file and decode it
   */
  async loadAudioFile(file: File): Promise<AudioMetadata> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      this.audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);

      const metadata: AudioMetadata = {
        duration: this.audioBuffer.duration,
        sampleRate: this.audioBuffer.sampleRate,
        channels: this.audioBuffer.numberOfChannels,
        format: file.type || 'audio/unknown',
        title: file.name.replace(/\.[^/.]+$/, ''),
      };

      return metadata;
    } catch (error) {
      console.error('Failed to load audio file:', error);
      throw new Error('Audio file loading failed');
    }
  }

  /**
   * Load audio from URL
   */
  async loadAudioURL(url: string): Promise<AudioMetadata> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.audioBuffer = await this.audioContext!.decodeAudioData(arrayBuffer);

      const metadata: AudioMetadata = {
        duration: this.audioBuffer.duration,
        sampleRate: this.audioBuffer.sampleRate,
        channels: this.audioBuffer.numberOfChannels,
        format: 'audio/unknown',
        title: url.split('/').pop() || 'Unknown',
      };

      return metadata;
    } catch (error) {
      console.error('Failed to load audio URL:', error);
      throw new Error('Audio URL loading failed');
    }
  }

  /**
   * Start audio playback
   */
  async play(startTime: number = 0): Promise<void> {
    if (!this.audioBuffer || !this.audioContext || !this.gainNode) {
      throw new Error('Audio not loaded or engine not initialized');
    }

    // Stop current playback
    this.stop();

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Create new source
    this.source = this.audioContext.createBufferSource();
    this.source.buffer = this.audioBuffer;
    this.source.connect(this.gainNode);

    // Start playback
    const offset = startTime + this.pauseTime;
    this.source.start(0, offset);
    this.startTime = this.audioContext.currentTime - offset;
    this.isPlaying = true;
    this.pauseTime = 0;

    // Handle playback end
    this.source.onended = () => {
      if (this.isPlaying) {
        this.isPlaying = false;
        this.pauseTime = 0;
      }
    };
  }

  /**
   * Pause audio playback
   */
  pause(): void {
    if (this.isPlaying && this.audioContext) {
      this.pauseTime = this.audioContext.currentTime - this.startTime;
      this.stop();
    }
  }

  /**
   * Stop audio playback
   */
  stop(): void {
    if (this.source) {
      try {
        this.source.stop();
      } catch (error) {
        // Source might already be stopped
      }
      this.source = null;
    }
    this.isPlaying = false;
    this.pauseTime = 0;
  }

  /**
   * Set playback volume (0-1)
   */
  setVolume(volume: number): void {
    if (this.gainNode) {
      this.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  /**
   * Get current playback time
   */
  getCurrentTime(): number {
    if (!this.audioContext) return 0;
    
    if (this.isPlaying) {
      return this.audioContext.currentTime - this.startTime;
    } else {
      return this.pauseTime;
    }
  }

  /**
   * Seek to specific time
   */
  async seekTo(time: number): Promise<void> {
    if (!this.audioBuffer) return;
    
    const wasPlaying = this.isPlaying;
    this.stop();
    this.pauseTime = Math.max(0, Math.min(time, this.audioBuffer.duration));
    
    if (wasPlaying) {
      await this.play();
    }
  }

  /**
   * Get real-time frequency and waveform data
   */
  getFrequencyData(): FrequencyData {
    if (!this.analyser) {
      return {
        frequencies: new Uint8Array(0),
        waveform: new Uint8Array(0),
        frequencyBinData: new Uint8Array(0),
        frequencyFloatData: new Float32Array(0),
        peak: 0,
        rms: 0,
        timestamp: Date.now()
      };
    }

    // Get frequency domain data
    const frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(frequencyData);
    
    // Get float frequency data
    const frequencyFloatData = new Float32Array(this.analyser.frequencyBinCount);
    this.analyser.getFloatFrequencyData(frequencyFloatData);
    
    // Get time domain data (waveform)
    const waveformData = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(waveformData);

    // Calculate peak and RMS
    let peak = 0;
    let rms = 0;
    for (let i = 0; i < waveformData.length; i++) {
      const rawSample = waveformData[i];
      if (rawSample !== undefined) {
        const sample = (rawSample - 128) / 128;
        peak = Math.max(peak, Math.abs(sample));
        rms += sample * sample;
      }
    }
    rms = Math.sqrt(rms / waveformData.length);

    return {
      frequencies: new Uint8Array(frequencyData),
      waveform: new Uint8Array(waveformData),
      frequencyBinData: new Uint8Array(frequencyData),
      frequencyFloatData: new Float32Array(frequencyFloatData),
      peak,
      rms,
      timestamp: Date.now()
    };
  }

  /**
   * Detect beats in real-time
   */
  detectBeats(): BeatData {
    if (!this.analyser) {
      return { bpm: 0, beats: [], confidence: 0 };
    }

    const rawFrequencyData = new Float32Array(this.analyser.frequencyBinCount);
    this.analyser.getFloatFrequencyData(rawFrequencyData);

    // Focus on lower frequencies for beat detection (20-200 Hz)
    const lowFreqSum = rawFrequencyData.slice(0, 20).reduce((sum, val) => sum + val, 0);
    const energy = lowFreqSum / 20;

    // Add to detection buffer
    this.beatDetectionBuffer.push(energy);
    if (this.beatDetectionBuffer.length > 100) {
      this.beatDetectionBuffer.shift();
    }

    // Simple beat detection algorithm
    const average = this.beatDetectionBuffer.reduce((sum, val) => sum + val, 0) / this.beatDetectionBuffer.length;
    const variance = this.beatDetectionBuffer.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / this.beatDetectionBuffer.length;
    const threshold = average + Math.sqrt(variance) * 1.5;

    const now = Date.now();
    let bpm = 0;
    const beats: number[] = [];

    if (energy > threshold && now - this.lastBeatTime > 300) { // Minimum 300ms between beats
      beats.push(now);
      this.lastBeatTime = now;
      
      // Calculate BPM from recent beats
      this.bpmHistory.push(now);
      if (this.bpmHistory.length > 10) {
        this.bpmHistory.shift();
      }
      
      if (this.bpmHistory.length > 1) {
        const intervals = [];
        for (let i = 1; i < this.bpmHistory.length; i++) {
          const current = this.bpmHistory[i];
          const previous = this.bpmHistory[i - 1];
          if (current !== undefined && previous !== undefined) {
            intervals.push(current - previous);
          }
        }
        if (intervals.length > 0) {
          const avgInterval = intervals.reduce((sum, val) => sum + val, 0) / intervals.length;
          bpm = Math.round(60000 / avgInterval); // Convert ms to BPM
        }
      }
    }

    const confidence = Math.min(this.bpmHistory.length / 10, 1);

    return { bpm, beats, confidence };
  }

  /**
   * Generate waveform for entire audio file
   */
  generateFullWaveform(samples: number = 1000): number[] {
    if (!this.audioBuffer) return [];

    const channelData = this.audioBuffer.getChannelData(0);
    const blockSize = Math.floor(channelData.length / samples);
    const waveform: number[] = [];

    for (let i = 0; i < samples; i++) {
      const start = i * blockSize;
      const end = start + blockSize;
      let sum = 0;

      for (let j = start; j < end && j < channelData.length; j++) {
        const sample = channelData[j];
        if (sample !== undefined) {
          sum += Math.abs(sample);
        }
      }

      waveform.push(sum / blockSize);
    }

    return waveform;
  }

  /**
   * Get audio buffer for advanced processing
   */
  getAudioBuffer(): AudioBuffer | null {
    return this.audioBuffer;
  }

  /**
   * Get audio context for advanced operations
   */
  getAudioContext(): AudioContext | null {
    return this.audioContext;
  }

  /**
   * Check if audio is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying;
  }

  /**
   * Get audio duration
   */
  getDuration(): number {
    return this.audioBuffer?.duration || 0;
  }

  /**
   * Cleanup resources
   */
  dispose(): void {
    this.stop();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.analyser = null;
    this.gainNode = null;
    this.audioBuffer = null;
    this.isInitialized = false;
  }
}
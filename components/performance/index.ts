// Performance optimization components and utilities
export { OptimizedImage } from './image-optimization';
export { 
  LazyWrapper,
  AudioPlayerFallback,
  VisualizerFallback,
  AlbumArtFallback,
  DashboardFallback,
  createLazyComponent,
  LazyAudioPlayer,
  LazyFloatingVisualizer,
  LazyAdminDashboard,
  withLazyLoading
} from './lazy-components';

export {
  PerformanceMonitor,
  usePerformanceMetrics,
  calculatePerformanceScore,
  sendPerformanceAnalytics
} from './performance-monitor';

export {
  SEO,
  generateSEOMetadata,
  generateAlbumSEO,
  generateArtistSEO,
  generateBlogSEO,
  generateSitemap
} from './seo-optimization';

export {
  memoryCache,
  localStorageCache,
  useCache,
  useApiCache,
  preloadCache,
  cleanupCaches
} from './caching-system';
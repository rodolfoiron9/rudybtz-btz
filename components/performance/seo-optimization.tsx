import Head from 'next/head';
import { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'music.song' | 'music.album';
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  structuredData?: object;
  noIndex?: boolean;
  noFollow?: boolean;
}

interface AlbumSEOProps extends SEOProps {
  albumTitle: string;
  artistName: string;
  releaseDate: string;
  genre: string;
  tracks: Array<{
    title: string;
    duration: number;
    audioUrl?: string;
  }>;
  albumCover?: string;
  price?: number;
}

interface ArtistSEOProps extends SEOProps {
  artistName: string;
  bio: string;
  genres: string[];
  socialLinks?: {
    spotify?: string;
    soundcloud?: string;
    youtube?: string;
    instagram?: string;
  };
}

// Base SEO component for client-side usage
export function SEO({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  structuredData,
  noIndex = false,
  noFollow = false
}: SEOProps) {
  const siteTitle = 'RUDYBTZ Portfolio';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  
  return (
    <Head>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Robots */}
      <meta name="robots" content={`${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`} />
      
      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:site_name" content={siteTitle} />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      {description && <meta name="twitter:description" content={description} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}

// Server-side metadata generation for app directory
export function generateSEOMetadata({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage,
  ogType = 'website',
  noIndex = false,
  noFollow = false
}: SEOProps): Metadata {
  const siteTitle = 'RUDYBTZ Portfolio';
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  
  return {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    robots: `${noIndex ? 'noindex' : 'index'},${noFollow ? 'nofollow' : 'follow'}`,
    ...(canonicalUrl && { alternates: { canonical: canonicalUrl } }),
    openGraph: {
      title: fullTitle,
      description,
      type: ogType as any,
      url: canonicalUrl,
      images: ogImage ? [{ url: ogImage }] : undefined,
      siteName: siteTitle,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

// Album-specific SEO
export function generateAlbumSEO({
  albumTitle,
  artistName,
  releaseDate,
  genre,
  tracks,
  albumCover,
  price,
  description,
  canonicalUrl
}: AlbumSEOProps) {
  const title = `${albumTitle} - ${artistName}`;
  const defaultDescription = `Listen to ${albumTitle} by ${artistName}. ${genre} album released ${new Date(releaseDate).getFullYear()}. ${tracks.length} tracks.`;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicAlbum",
    "name": albumTitle,
    "byArtist": {
      "@type": "MusicGroup",
      "name": artistName
    },
    "datePublished": releaseDate,
    "genre": genre,
    "numTracks": tracks.length,
    "track": tracks.map((track, index) => ({
      "@type": "MusicRecording",
      "name": track.title,
      "duration": `PT${Math.floor(track.duration / 60)}M${track.duration % 60}S`,
      "trackNumber": index + 1,
      "inAlbum": albumTitle,
      "byArtist": artistName,
      ...(track.audioUrl && { "audio": track.audioUrl })
    })),
    ...(albumCover && { "image": albumCover }),
    ...(price && {
      "offers": {
        "@type": "Offer",
        "price": price,
        "priceCurrency": "USD",
        "availability": "https://schema.org/InStock"
      }
    })
  };

  return {
    title,
    description: description || defaultDescription,
    keywords: [artistName, albumTitle, genre, 'music', 'album', 'electronic music'],
    ogImage: albumCover,
    ogType: 'music.album' as const,
    canonicalUrl,
    structuredData
  };
}

// Artist-specific SEO
export function generateArtistSEO({
  artistName,
  bio,
  genres,
  socialLinks,
  description,
  canonicalUrl,
  ogImage
}: ArtistSEOProps) {
  const title = `${artistName} - Electronic Music Producer`;
  const defaultDescription = bio.length > 160 ? `${bio.substring(0, 157)}...` : bio;
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": artistName,
    "description": bio,
    "genre": genres,
    "url": canonicalUrl,
    ...(socialLinks && {
      "sameAs": [
        socialLinks.spotify,
        socialLinks.soundcloud,
        socialLinks.youtube,
        socialLinks.instagram
      ].filter(Boolean)
    })
  };

  return {
    title,
    description: description || defaultDescription,
    keywords: [artistName, ...genres, 'music producer', 'electronic music', 'artist'],
    ogImage,
    ogType: 'profile' as const,
    canonicalUrl,
    structuredData
  };
}

// Blog post SEO
export function generateBlogSEO({
  title,
  description,
  canonicalUrl,
  ogImage,
  publishedDate,
  modifiedDate,
  author = 'Rudy BTZ',
  tags = []
}: {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  publishedDate: string;
  modifiedDate?: string;
  author?: string;
  tags?: string[];
}) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": title,
    "description": description,
    "author": {
      "@type": "Person",
      "name": author
    },
    "datePublished": publishedDate,
    "dateModified": modifiedDate || publishedDate,
    "url": canonicalUrl,
    ...(ogImage && { "image": ogImage }),
    ...(tags.length > 0 && { "keywords": tags.join(', ') })
  };

  return {
    title,
    description,
    keywords: [...tags, 'music production', 'technology', 'blog'],
    ogImage,
    ogType: 'article' as const,
    canonicalUrl,
    structuredData
  };
}

// Sitemap generation helper
export function generateSitemap(pages: Array<{
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}>) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `
  <url>
    <loc>${page.url}</loc>
    ${page.lastModified ? `<lastmod>${page.lastModified.toISOString()}</lastmod>` : ''}
    ${page.changeFrequency ? `<changefreq>${page.changeFrequency}</changefreq>` : ''}
    ${page.priority ? `<priority>${page.priority}</priority>` : ''}
  </url>
`).join('')}
</urlset>`;

  return sitemap;
}
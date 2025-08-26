'use client';

export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "name": "RUDYBTZ",
    "url": "https://rudybtz.com",
    "description": "Electronic music producer crafting immersive sonic experiences through innovative sound design and cutting-edge production techniques.",
    "genre": ["Electronic", "EDM", "Future Bass", "Synthwave"],
    "foundingDate": "2020",
    "member": {
      "@type": "Person",
      "name": "RUDYBTZ"
    },
    "sameAs": [
      "https://instagram.com/rudybtz",
      "https://twitter.com/rudybtz",
      "https://youtube.com/@rudybtz",
      "https://soundcloud.com/rudybtz"
    ],
    "album": [
      {
        "@type": "MusicAlbum",
        "name": "Neon Horizons",
        "datePublished": "2024",
        "byArtist": {
          "@type": "MusicGroup",
          "name": "RUDYBTZ"
        }
      },
      {
        "@type": "MusicAlbum",
        "name": "Quantum Beats",
        "datePublished": "2023",
        "byArtist": {
          "@type": "MusicGroup",
          "name": "RUDYBTZ"
        }
      },
      {
        "@type": "MusicAlbum",
        "name": "Synthwave Odyssey",
        "datePublished": "2023",
        "byArtist": {
          "@type": "MusicGroup",
          "name": "RUDYBTZ"
        }
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
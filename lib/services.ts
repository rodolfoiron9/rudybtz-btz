import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  serverTimestamp,
  type DocumentData 
} from 'firebase/firestore';
import { db } from './firebase';
import type { 
  Album, 
  Track, 
  HeroSlide, 
  VisualizerPreset, 
  BlogPost, 
  ArtistBioEntry, 
  ThemeConfig, 
  SiteConfig, 
  KnowledgeEntry 
} from './types';

// Albums Collection
export const albumsService = {
  async getAll(): Promise<Album[]> {
    const q = query(collection(db, 'albums'), orderBy('releaseDate', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Album));
  },

  async getById(id: string): Promise<Album | null> {
    const docRef = doc(db, 'albums', id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Album : null;
  },

  async create(album: Omit<Album, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'albums'), {
      ...album,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Album>): Promise<void> {
    const docRef = doc(db, 'albums', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'albums', id));
  }
};

// Tracks Collection
export const tracksService = {
  async getByAlbumId(albumId: string): Promise<Track[]> {
    const q = query(
      collection(db, 'tracks'), 
      where('albumId', '==', albumId),
      orderBy('createdAt')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Track));
  },

  async create(track: Omit<Track, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'tracks'), {
      ...track,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<Track>): Promise<void> {
    const docRef = doc(db, 'tracks', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'tracks', id));
  }
};

// Hero Slides Collection
export const heroSlidesService = {
  async getAll(): Promise<HeroSlide[]> {
    const q = query(collection(db, 'heroSlides'), orderBy('order'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as HeroSlide));
  },

  async create(slide: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'heroSlides'), {
      ...slide,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<HeroSlide>): Promise<void> {
    const docRef = doc(db, 'heroSlides', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'heroSlides', id));
  }
};

// Visualizer Presets Collection
export const visualizerPresetsService = {
  async getAll(): Promise<VisualizerPreset[]> {
    const q = query(collection(db, 'visualizerPresets'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VisualizerPreset));
  },

  async create(preset: Omit<VisualizerPreset, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'visualizerPresets'), {
      ...preset,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<VisualizerPreset>): Promise<void> {
    const docRef = doc(db, 'visualizerPresets', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'visualizerPresets', id));
  }
};

// Blog Posts Collection
export const blogPostsService = {
  async getAll(): Promise<BlogPost[]> {
    const q = query(collection(db, 'blogPosts'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  },

  async create(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'blogPosts'), {
      ...post,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<BlogPost>): Promise<void> {
    const docRef = doc(db, 'blogPosts', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'blogPosts', id));
  }
};

// Artist Bio Entries Collection
export const artistBioService = {
  async getAll(): Promise<ArtistBioEntry[]> {
    const q = query(collection(db, 'artistBio'), orderBy('order'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArtistBioEntry));
  },

  async create(entry: Omit<ArtistBioEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'artistBio'), {
      ...entry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<ArtistBioEntry>): Promise<void> {
    const docRef = doc(db, 'artistBio', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'artistBio', id));
  }
};

// Theme Config (Single Document)
export const themeConfigService = {
  async get(): Promise<ThemeConfig | null> {
    const docRef = doc(db, 'themeConfig', 'live');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: 'live', ...docSnap.data() } as ThemeConfig : null;
  },

  async update(updates: Partial<ThemeConfig>): Promise<void> {
    const docRef = doc(db, 'themeConfig', 'live');
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }
};

// Site Config (Single Document)
export const siteConfigService = {
  async get(): Promise<SiteConfig | null> {
    const docRef = doc(db, 'siteConfig', 'live');
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: 'live', ...docSnap.data() } as SiteConfig : null;
  },

  async update(updates: Partial<SiteConfig>): Promise<void> {
    const docRef = doc(db, 'siteConfig', 'live');
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  }
};

// Knowledge Base Collection
export const knowledgeBaseService = {
  async getAll(): Promise<KnowledgeEntry[]> {
    const q = query(collection(db, 'knowledgeBase'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as KnowledgeEntry));
  },

  async getByType(type: KnowledgeEntry['type']): Promise<KnowledgeEntry[]> {
    const q = query(
      collection(db, 'knowledgeBase'), 
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as KnowledgeEntry));
  },

  async create(entry: Omit<KnowledgeEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, 'knowledgeBase'), {
      ...entry,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  },

  async update(id: string, updates: Partial<KnowledgeEntry>): Promise<void> {
    const docRef = doc(db, 'knowledgeBase', id);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'knowledgeBase', id));
  }
};
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  setDoc,
  Timestamp 
} from 'firebase/firestore';
import { db } from './firebase';
import type { Album, Track, HeroSlide, BlogPost, ArtistBioEntry, VisualizerPreset, ThemeConfig, SiteConfig, KnowledgeBaseEntry } from './types';

// Albums Service
export const albumsService = {
  async getAll(): Promise<Album[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'albums'), orderBy('releaseDate', 'desc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      releaseDate: doc.data().releaseDate.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Album[];
  },

  async getById(id: string): Promise<Album | null> {
    const docSnap = await getDoc(doc(db, 'albums', id));
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        releaseDate: data.releaseDate.toDate(),
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as Album;
    }
    return null;
  },

  async create(albumData: Omit<Album, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'albums'), {
      ...albumData,
      releaseDate: Timestamp.fromDate(albumData.releaseDate),
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  async update(id: string, albumData: Partial<Omit<Album, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    const updateData: any = {
      ...albumData,
      updatedAt: Timestamp.now(),
    };
    
    if (albumData.releaseDate) {
      updateData.releaseDate = Timestamp.fromDate(albumData.releaseDate);
    }
    
    await updateDoc(doc(db, 'albums', id), updateData);
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'albums', id));
  }
};

// Tracks Service
export const tracksService = {
  async getByAlbumId(albumId: string): Promise<Track[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'tracks'), where('albumId', '==', albumId))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as Track[];
  },

  async create(trackData: Omit<Track, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'tracks'), {
      ...trackData,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  async update(id: string, trackData: Partial<Omit<Track, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    await updateDoc(doc(db, 'tracks', id), {
      ...trackData,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'tracks', id));
  }
};

// Hero Slides Service
export const heroSlidesService = {
  async getAll(): Promise<HeroSlide[]> {
    const querySnapshot = await getDocs(
      query(collection(db, 'heroSlides'), orderBy('order', 'asc'))
    );
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
    })) as HeroSlide[];
  },

  async create(slideData: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'heroSlides'), {
      ...slideData,
      createdAt: now,
      updatedAt: now,
    });
    return docRef.id;
  },

  async update(id: string, slideData: Partial<Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>>): Promise<void> {
    await updateDoc(doc(db, 'heroSlides', id), {
      ...slideData,
      updatedAt: Timestamp.now(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'heroSlides', id));
  }
};

// Blog Services
export const blogService = {
  async createPost(data: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const postData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const docRef = await addDoc(collection(db, 'blog'), postData);
    return docRef.id;
  },

  async updatePost(id: string, data: Partial<BlogPost>): Promise<void> {
    const postRef = doc(db, 'blog', id);
    await updateDoc(postRef, {
      ...data,
      updatedAt: new Date()
    });
  },

  async deletePost(id: string): Promise<void> {
    await deleteDoc(doc(db, 'blog', id));
  },

  async getPost(id: string): Promise<BlogPost | null> {
    const postSnap = await getDoc(doc(db, 'blog', id));
    if (postSnap.exists()) {
      return { id: postSnap.id, ...postSnap.data() } as BlogPost;
    }
    return null;
  },

  async getAllPosts(): Promise<BlogPost[]> {
    const postsSnap = await getDocs(collection(db, 'blog'));
    return postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  },

  async getPublishedPosts(): Promise<BlogPost[]> {
    const q = query(collection(db, 'blog'), where('published', '==', true));
    const postsSnap = await getDocs(q);
    return postsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as BlogPost));
  }
};

// Artist Bio Services
export const artistBioService = {
  async createEntry(data: Omit<ArtistBioEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const entryData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const docRef = await addDoc(collection(db, 'artistBio'), entryData);
    return docRef.id;
  },

  async updateEntry(id: string, data: Partial<ArtistBioEntry>): Promise<void> {
    const entryRef = doc(db, 'artistBio', id);
    await updateDoc(entryRef, {
      ...data,
      updatedAt: new Date()
    });
  },

  async deleteEntry(id: string): Promise<void> {
    await deleteDoc(doc(db, 'artistBio', id));
  },

  async getEntry(id: string): Promise<ArtistBioEntry | null> {
    const entrySnap = await getDoc(doc(db, 'artistBio', id));
    if (entrySnap.exists()) {
      return { id: entrySnap.id, ...entrySnap.data() } as ArtistBioEntry;
    }
    return null;
  },

  async getAllEntries(): Promise<ArtistBioEntry[]> {
    const q = query(collection(db, 'artistBio'), orderBy('year', 'desc'));
    const entriesSnap = await getDocs(q);
    return entriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ArtistBioEntry));
  }
};

// Visualizer Presets Services
export const visualizerPresetsService = {
  async createPreset(data: Omit<VisualizerPreset, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const presetData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const docRef = await addDoc(collection(db, 'visualizerPresets'), presetData);
    return docRef.id;
  },

  async updatePreset(id: string, data: Partial<VisualizerPreset>): Promise<void> {
    const presetRef = doc(db, 'visualizerPresets', id);
    await updateDoc(presetRef, {
      ...data,
      updatedAt: new Date()
    });
  },

  async deletePreset(id: string): Promise<void> {
    await deleteDoc(doc(db, 'visualizerPresets', id));
  },

  async getPreset(id: string): Promise<VisualizerPreset | null> {
    const presetSnap = await getDoc(doc(db, 'visualizerPresets', id));
    if (presetSnap.exists()) {
      return { id: presetSnap.id, ...presetSnap.data() } as VisualizerPreset;
    }
    return null;
  },

  async getAllPresets(): Promise<VisualizerPreset[]> {
    const presetsSnap = await getDocs(collection(db, 'visualizerPresets'));
    return presetsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as VisualizerPreset));
  },

  async getDefaultPreset(): Promise<VisualizerPreset | null> {
    const q = query(collection(db, 'visualizerPresets'), where('isDefault', '==', true));
    const presetsSnap = await getDocs(q);
    const firstDoc = presetsSnap.docs[0];
    if (firstDoc) {
      return { id: firstDoc.id, ...firstDoc.data() } as VisualizerPreset;
    }
    return null;
  }
};

// Knowledge Base Services
export const knowledgeBaseService = {
  async createEntry(data: Omit<KnowledgeBaseEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const entryData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const docRef = await addDoc(collection(db, 'knowledgeBase'), entryData);
    return docRef.id;
  },

  async updateEntry(id: string, data: Partial<KnowledgeBaseEntry>): Promise<void> {
    const entryRef = doc(db, 'knowledgeBase', id);
    await updateDoc(entryRef, {
      ...data,
      updatedAt: new Date()
    });
  },

  async deleteEntry(id: string): Promise<void> {
    await deleteDoc(doc(db, 'knowledgeBase', id));
  },

  async getEntry(id: string): Promise<KnowledgeBaseEntry | null> {
    const entrySnap = await getDoc(doc(db, 'knowledgeBase', id));
    if (entrySnap.exists()) {
      return { id: entrySnap.id, ...entrySnap.data() } as KnowledgeBaseEntry;
    }
    return null;
  },

  async getAllEntries(): Promise<KnowledgeBaseEntry[]> {
    const q = query(collection(db, 'knowledgeBase'), orderBy('createdAt', 'desc'));
    const entriesSnap = await getDocs(q);
    return entriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as KnowledgeBaseEntry));
  },

  async getEntriesByCategory(category: string): Promise<KnowledgeBaseEntry[]> {
    const q = query(
      collection(db, 'knowledgeBase'), 
      where('category', '==', category),
      orderBy('createdAt', 'desc')
    );
    const entriesSnap = await getDocs(q);
    return entriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as KnowledgeBaseEntry));
  },

  async searchEntries(searchTerm: string): Promise<KnowledgeBaseEntry[]> {
    // Note: Firestore doesn't support full-text search natively
    // This is a simple implementation that would need to be enhanced
    // with a proper search solution like Algolia or Elasticsearch
    const entriesSnap = await getDocs(collection(db, 'knowledgeBase'));
    const allEntries = entriesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as KnowledgeBaseEntry));
    
    const searchLower = searchTerm.toLowerCase();
    return allEntries.filter(entry => 
      entry.title.toLowerCase().includes(searchLower) ||
      entry.content.toLowerCase().includes(searchLower) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }
};

// Theme Configuration Services
export const themeConfigService = {
  async getThemeConfig(): Promise<ThemeConfig | null> {
    const configSnap = await getDoc(doc(db, 'config', 'theme'));
    if (configSnap.exists()) {
      return configSnap.data() as ThemeConfig;
    }
    return null;
  },

  async updateThemeConfig(data: Partial<ThemeConfig>): Promise<void> {
    const configRef = doc(db, 'config', 'theme');
    await setDoc(configRef, {
      ...data,
      id: 'live',
      updatedAt: new Date()
    }, { merge: true });
  },

  async resetToDefault(): Promise<void> {
    const defaultTheme: ThemeConfig = {
      id: 'live',
      primaryColor: '#8B5CF6',
      secondaryColor: '#06B6D4',
      backgroundColor: '#000814',
      textColor: '#F8FAFC',
      headlineFont: 'Inter',
      bodyFont: 'Inter',
      fontSize: {
        small: '0.875rem',
        medium: '1rem',
        large: '1.25rem',
        xlarge: '2rem'
      },
      spacing: {
        small: '0.5rem',
        medium: '1rem',
        large: '2rem'
      },
      borderRadius: '0.5rem',
      updatedAt: new Date()
    };
    
    await setDoc(doc(db, 'config', 'theme'), defaultTheme);
  }
};

// Site Configuration Services
export const siteConfigService = {
  async getSiteConfig(): Promise<SiteConfig | null> {
    const configSnap = await getDoc(doc(db, 'config', 'site'));
    if (configSnap.exists()) {
      return configSnap.data() as SiteConfig;
    }
    return null;
  },

  async updateSiteConfig(data: Partial<SiteConfig>): Promise<void> {
    const configRef = doc(db, 'config', 'site');
    await setDoc(configRef, {
      ...data,
      id: 'live',
      updatedAt: new Date()
    }, { merge: true });
  }
};
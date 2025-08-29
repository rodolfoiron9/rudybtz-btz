'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  User, 
  Camera, 
  Save, 
  Upload, 
  Download, 
  Edit, 
  Plus, 
  Trash2, 
  ExternalLink,
  Calendar,
  MapPin,
  Globe,
  Music,
  Award,
  Briefcase,
  Heart,
  Share2,
  Instagram,
  Twitter,
  Youtube,
  Facebook,
  Linkedin,
  Github,
  Mail,
  Phone,
  Eye,
  EyeOff,
  Star,
  Mic,
  Headphones,
  Disc
} from 'lucide-react';

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  username: string;
  isVisible: boolean;
  verified?: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'award' | 'milestone' | 'collaboration' | 'release' | 'performance';
  isHighlighted: boolean;
}

interface CareerMilestone {
  id: string;
  year: string;
  title: string;
  description: string;
  type: 'album' | 'performance' | 'collaboration' | 'award' | 'other';
}

interface ArtistProfile {
  // Basic Info
  displayName: string;
  realName: string;
  stageName: string;
  bio: string;
  shortBio: string;
  profileImage: string;
  coverImage: string;
  
  // Location & Contact
  location: string;
  website: string;
  email: string;
  phone: string;
  
  // Career Info
  genres: string[];
  instruments: string[];
  yearsActive: string;
  recordLabel: string;
  managementContact: string;
  
  // Stats
  totalTracks: number;
  totalAlbums: number;
  totalStreams: string;
  monthlyListeners: string;
  
  // Settings
  isPublic: boolean;
  showContactInfo: boolean;
  allowBookings: boolean;
  showStats: boolean;
}

const ArtistBioManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profile, setProfile] = useState<ArtistProfile>({
    displayName: 'Rudy Benzies',
    realName: 'Rodolfo Benzies',
    stageName: 'RudyBtz',
    bio: 'AI-powered music producer and software developer passionate about creating immersive audio experiences through cutting-edge technology. Specializing in electronic music production with real-time visualization and interactive soundscapes.',
    shortBio: 'AI-powered music producer creating immersive audio experiences.',
    profileImage: '',
    coverImage: '',
    location: 'Global Digital Artist',
    website: 'https://rudyalbums.com',
    email: 'contact@rudyalbums.com',
    phone: '',
    genres: ['Electronic', 'AI Music', 'Ambient', 'Techno', 'Experimental'],
    instruments: ['Digital Audio Workstation', 'AI Tools', 'Synthesizers', 'Programming'],
    yearsActive: '2020 - Present',
    recordLabel: 'Independent',
    managementContact: '',
    totalTracks: 24,
    totalAlbums: 3,
    totalStreams: '50K+',
    monthlyListeners: '2.5K',
    isPublic: true,
    showContactInfo: true,
    allowBookings: true,
    showStats: true
  });

  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([
    {
      id: 'instagram',
      platform: 'Instagram',
      url: 'https://instagram.com/rudybtz',
      username: '@rudybtz',
      isVisible: true
    },
    {
      id: 'twitter',
      platform: 'Twitter',
      url: 'https://twitter.com/rudybtz',
      username: '@rudybtz',
      isVisible: true
    },
    {
      id: 'youtube',
      platform: 'YouTube',
      url: 'https://youtube.com/@rudybtz',
      username: 'Rudy Benzies',
      isVisible: true
    },
    {
      id: 'spotify',
      platform: 'Spotify',
      url: 'https://open.spotify.com/artist/rudybtz',
      username: 'Rudy Benzies',
      isVisible: true,
      verified: true
    },
    {
      id: 'soundcloud',
      platform: 'SoundCloud',
      url: 'https://soundcloud.com/rudybtz',
      username: 'rudybtz',
      isVisible: true
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'ach_1',
      title: 'AI Music Innovation Award',
      description: 'Recognized for pioneering AI-powered music production techniques',
      date: '2024',
      category: 'award',
      isHighlighted: true
    },
    {
      id: 'ach_2',
      title: '50K+ Total Streams',
      description: 'Achieved significant streaming milestone across all platforms',
      date: '2024',
      category: 'milestone',
      isHighlighted: true
    },
    {
      id: 'ach_3',
      title: 'Featured on Tech Music Blog',
      description: 'Interview about AI in music production published on leading tech blog',
      date: '2024',
      category: 'collaboration',
      isHighlighted: false
    }
  ]);

  const [careerMilestones, setCareerMilestones] = useState<CareerMilestone[]>([
    {
      id: 'mile_1',
      year: '2024',
      title: 'Released "AI Symphonies" Album',
      description: 'Debut album featuring AI-generated compositions with human creativity',
      type: 'album'
    },
    {
      id: 'mile_2',
      year: '2024',
      title: 'Developed Real-time Audio Visualizer',
      description: 'Created innovative 3D visualization system for live performances',
      type: 'other'
    },
    {
      id: 'mile_3',
      year: '2023',
      title: 'First Live Performance',
      description: 'Debut live set at Electronic Music Festival',
      type: 'performance'
    }
  ]);

  const profileImageRef = useRef<HTMLInputElement>(null);
  const coverImageRef = useRef<HTMLInputElement>(null);

  const socialPlatforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram, color: 'text-pink-500' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, color: 'text-blue-400' },
    { id: 'youtube', name: 'YouTube', icon: Youtube, color: 'text-red-500' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, color: 'text-blue-600' },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, color: 'text-blue-500' },
    { id: 'github', name: 'GitHub', icon: Github, color: 'text-gray-400' }
  ];

  const achievementCategories = [
    { id: 'award', name: 'Awards', icon: Award, color: 'text-yellow-500' },
    { id: 'milestone', name: 'Milestones', icon: Star, color: 'text-purple-500' },
    { id: 'collaboration', name: 'Collaborations', icon: Heart, color: 'text-red-500' },
    { id: 'release', name: 'Releases', icon: Disc, color: 'text-blue-500' },
    { id: 'performance', name: 'Performances', icon: Mic, color: 'text-green-500' }
  ];

  const handleImageUpload = (type: 'profile' | 'cover') => {
    const input = type === 'profile' ? profileImageRef.current : coverImageRef.current;
    if (input) {
      input.click();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'cover') => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile(prev => ({
        ...prev,
        [type === 'profile' ? 'profileImage' : 'coverImage']: url
      }));
    }
  };

  const addSocialLink = () => {
    const newLink: SocialLink = {
      id: `social_${Date.now()}`,
      platform: 'Custom',
      url: '',
      username: '',
      isVisible: true
    };
    setSocialLinks(prev => [...prev, newLink]);
  };

  const updateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    setSocialLinks(prev => prev.map(link => 
      link.id === id ? { ...link, ...updates } : link
    ));
  };

  const deleteSocialLink = (id: string) => {
    setSocialLinks(prev => prev.filter(link => link.id !== id));
  };

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: `ach_${Date.now()}`,
      title: 'New Achievement',
      description: '',
      date: new Date().getFullYear().toString(),
      category: 'milestone',
      isHighlighted: false
    };
    setAchievements(prev => [...prev, newAchievement]);
  };

  const updateAchievement = (id: string, updates: Partial<Achievement>) => {
    setAchievements(prev => prev.map(ach => 
      ach.id === id ? { ...ach, ...updates } : ach
    ));
  };

  const deleteAchievement = (id: string) => {
    setAchievements(prev => prev.filter(ach => ach.id !== id));
  };

  const addMilestone = () => {
    const newMilestone: CareerMilestone = {
      id: `mile_${Date.now()}`,
      year: new Date().getFullYear().toString(),
      title: 'New Milestone',
      description: '',
      type: 'other'
    };
    setCareerMilestones(prev => [...prev, newMilestone]);
  };

  const updateMilestone = (id: string, updates: Partial<CareerMilestone>) => {
    setCareerMilestones(prev => prev.map(mile => 
      mile.id === id ? { ...mile, ...updates } : mile
    ));
  };

  const deleteMilestone = (id: string) => {
    setCareerMilestones(prev => prev.filter(mile => mile.id !== id));
  };

  const saveProfile = () => {
    // In a real app, this would save to a backend
    console.log('Saving profile:', { profile, socialLinks, achievements, careerMilestones });
    setIsEditing(false);
  };

  const getSocialIcon = (platform: string) => {
    const platformData = socialPlatforms.find(p => p.id === platform.toLowerCase());
    return platformData ? platformData.icon : Globe;
  };

  const getSocialColor = (platform: string) => {
    const platformData = socialPlatforms.find(p => p.id === platform.toLowerCase());
    return platformData ? platformData.color : 'text-gray-400';
  };

  const getAchievementIcon = (category: Achievement['category']) => {
    const categoryData = achievementCategories.find(c => c.id === category);
    return categoryData ? categoryData.icon : Star;
  };

  const getAchievementColor = (category: Achievement['category']) => {
    const categoryData = achievementCategories.find(c => c.id === category);
    return categoryData ? categoryData.color : 'text-gray-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-3d-silver-violet silver-violet">Artist Biography</h2>
          <p className="text-muted mt-1">Manage your artist profile, social media, and career timeline</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'default' : 'outline'}
            className="cyber-button-primary"
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Finish Editing' : 'Edit Profile'}
          </Button>
          <Button onClick={saveProfile} className="cyber-button-primary">
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-sm text-muted">Albums</p>
                <p className="text-2xl font-bold text-white">{profile.totalAlbums}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-sm text-muted">Tracks</p>
                <p className="text-2xl font-bold text-white">{profile.totalTracks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-sm text-muted">Streams</p>
                <p className="text-2xl font-bold text-white">{profile.totalStreams}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="cyber-card">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-400" />
              <div>
                <p className="text-sm text-muted">Monthly</p>
                <p className="text-2xl font-bold text-white">{profile.monthlyListeners}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="social">Social Media</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            {/* Profile Images */}
            <div className="space-y-6">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-lg">Profile Images</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Profile Image */}
                  <div>
                    <Label>Profile Image</Label>
                    <div className="relative w-32 h-32 mx-auto">
                      <div className="w-32 h-32 rounded-full bg-gray-800 border border-gray-600 overflow-hidden">
                        {profile.profileImage ? (
                          <img 
                            src={profile.profileImage} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="w-16 h-16 text-muted" />
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <Button
                          size="sm"
                          onClick={() => handleImageUpload('profile')}
                          className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 cyber-button-primary"
                        >
                          <Camera className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Cover Image */}
                  <div>
                    <Label>Cover Image</Label>
                    <div className="relative w-full h-24 rounded-lg bg-gray-800 border border-gray-600 overflow-hidden">
                      {profile.coverImage ? (
                        <img 
                          src={profile.coverImage} 
                          alt="Cover" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Camera className="w-8 h-8 text-muted" />
                        </div>
                      )}
                      {isEditing && (
                        <Button
                          size="sm"
                          onClick={() => handleImageUpload('cover')}
                          className="absolute top-2 right-2 cyber-button-primary"
                        >
                          <Upload className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <input
                    ref={profileImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, 'profile')}
                    aria-label="Upload profile image"
                  />
                  <input
                    ref={coverImageRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e, 'cover')}
                    aria-label="Upload cover image"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Basic Info */}
            <div className="col-span-2">
              <Card className="cyber-card">
                <CardHeader>
                  <CardTitle className="text-lg">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profile.displayName}
                        onChange={(e) => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="stageName">Stage Name</Label>
                      <Input
                        id="stageName"
                        value={profile.stageName}
                        onChange={(e) => setProfile(prev => ({ ...prev, stageName: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="realName">Real Name</Label>
                    <Input
                      id="realName"
                      value={profile.realName}
                      onChange={(e) => setProfile(prev => ({ ...prev, realName: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="shortBio">Short Bio (for previews)</Label>
                    <Textarea
                      id="shortBio"
                      value={profile.shortBio}
                      onChange={(e) => setProfile(prev => ({ ...prev, shortBio: e.target.value }))}
                      rows={2}
                      disabled={!isEditing}
                      maxLength={150}
                    />
                    <p className="text-xs text-muted mt-1">{profile.shortBio.length}/150 characters</p>
                  </div>

                  <div>
                    <Label htmlFor="bio">Full Biography</Label>
                    <Textarea
                      id="bio"
                      value={profile.bio}
                      onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                      rows={6}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profile.location}
                        onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="yearsActive">Years Active</Label>
                      <Input
                        id="yearsActive"
                        value={profile.yearsActive}
                        onChange={(e) => setProfile(prev => ({ ...prev, yearsActive: e.target.value }))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="genres">Genres (comma separated)</Label>
                    <Input
                      id="genres"
                      value={profile.genres.join(', ')}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        genres: e.target.value.split(',').map(g => g.trim()).filter(Boolean)
                      }))}
                      disabled={!isEditing}
                    />
                  </div>

                  <div>
                    <Label htmlFor="instruments">Instruments/Tools (comma separated)</Label>
                    <Input
                      id="instruments"
                      value={profile.instruments.join(', ')}
                      onChange={(e) => setProfile(prev => ({ 
                        ...prev, 
                        instruments: e.target.value.split(',').map(i => i.trim()).filter(Boolean)
                      }))}
                      disabled={!isEditing}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Social Media Links</CardTitle>
                {isEditing && (
                  <Button onClick={addSocialLink} className="cyber-button-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {socialLinks.map((link) => {
                  const Icon = getSocialIcon(link.platform);
                  const colorClass = getSocialColor(link.platform);
                  
                  return (
                    <div key={link.id} className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                      <Icon className={`w-6 h-6 ${colorClass}`} />
                      <div className="flex-1 grid grid-cols-3 gap-4">
                        <Input
                          placeholder="Platform"
                          value={link.platform}
                          onChange={(e) => updateSocialLink(link.id, { platform: e.target.value })}
                          disabled={!isEditing}
                        />
                        <Input
                          placeholder="URL"
                          value={link.url}
                          onChange={(e) => updateSocialLink(link.id, { url: e.target.value })}
                          disabled={!isEditing}
                        />
                        <Input
                          placeholder="Username"
                          value={link.username}
                          onChange={(e) => updateSocialLink(link.id, { username: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateSocialLink(link.id, { isVisible: !link.isVisible })}
                          disabled={!isEditing}
                        >
                          {link.isVisible ? (
                            <Eye className="w-4 h-4 text-green-400" />
                          ) : (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          )}
                        </Button>
                        {link.verified && (
                          <Badge variant="outline" className="text-blue-400 border-blue-400">
                            Verified
                          </Badge>
                        )}
                        {isEditing && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSocialLink(link.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Achievements & Awards</CardTitle>
                {isEditing && (
                  <Button onClick={addAchievement} className="cyber-button-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Achievement
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => {
                  const Icon = getAchievementIcon(achievement.category);
                  const colorClass = getAchievementColor(achievement.category);
                  
                  return (
                    <div key={achievement.id} className="p-4 bg-gray-800/50 rounded-lg">
                      <div className="flex items-start gap-4">
                        <Icon className={`w-6 h-6 ${colorClass} mt-1`} />
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Input
                              placeholder="Achievement title"
                              value={achievement.title}
                              onChange={(e) => updateAchievement(achievement.id, { title: e.target.value })}
                              disabled={!isEditing}
                              className="font-medium"
                            />
                            <Input
                              placeholder="Year"
                              value={achievement.date}
                              onChange={(e) => updateAchievement(achievement.id, { date: e.target.value })}
                              disabled={!isEditing}
                              className="w-24"
                            />
                          </div>
                          <Textarea
                            placeholder="Description"
                            value={achievement.description}
                            onChange={(e) => updateAchievement(achievement.id, { description: e.target.value })}
                            disabled={!isEditing}
                            rows={2}
                          />
                          <div className="flex items-center gap-4">
                            <select
                              value={achievement.category}
                              onChange={(e) => updateAchievement(achievement.id, { category: e.target.value as Achievement['category'] })}
                              disabled={!isEditing}
                              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
                              aria-label="Achievement category"
                            >
                              {achievementCategories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={achievement.isHighlighted}
                                onCheckedChange={(checked) => updateAchievement(achievement.id, { isHighlighted: checked })}
                                disabled={!isEditing}
                              />
                              <Label className="text-sm">Highlight</Label>
                            </div>
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteAchievement(achievement.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-6">
          <Card className="cyber-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Career Timeline</CardTitle>
                {isEditing && (
                  <Button onClick={addMilestone} className="cyber-button-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Milestone
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careerMilestones.sort((a, b) => parseInt(b.year) - parseInt(a.year)).map((milestone) => (
                  <div key={milestone.id} className="p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-16 text-center">
                        <Input
                          value={milestone.year}
                          onChange={(e) => updateMilestone(milestone.id, { year: e.target.value })}
                          disabled={!isEditing}
                          className="text-center text-sm font-bold"
                        />
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder="Milestone title"
                          value={milestone.title}
                          onChange={(e) => updateMilestone(milestone.id, { title: e.target.value })}
                          disabled={!isEditing}
                          className="font-medium"
                        />
                        <Textarea
                          placeholder="Description"
                          value={milestone.description}
                          onChange={(e) => updateMilestone(milestone.id, { description: e.target.value })}
                          disabled={!isEditing}
                          rows={2}
                        />
                        <div className="flex items-center gap-4">
                          <select
                            value={milestone.type}
                            onChange={(e) => updateMilestone(milestone.id, { type: e.target.value as CareerMilestone['type'] })}
                            disabled={!isEditing}
                            className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
                            aria-label="Milestone type"
                          >
                            <option value="album">Album</option>
                            <option value="performance">Performance</option>
                            <option value="collaboration">Collaboration</option>
                            <option value="award">Award</option>
                            <option value="other">Other</option>
                          </select>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteMilestone(milestone.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-lg">Visibility Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Public Profile</Label>
                    <p className="text-sm text-muted">Make your profile visible to everyone</p>
                  </div>
                  <Switch
                    checked={profile.isPublic}
                    onCheckedChange={(checked) => setProfile(prev => ({ ...prev, isPublic: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Contact Info</Label>
                    <p className="text-sm text-muted">Display email and phone publicly</p>
                  </div>
                  <Switch
                    checked={profile.showContactInfo}
                    onCheckedChange={(checked) => setProfile(prev => ({ ...prev, showContactInfo: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Bookings</Label>
                    <p className="text-sm text-muted">Enable booking requests</p>
                  </div>
                  <Switch
                    checked={profile.allowBookings}
                    onCheckedChange={(checked) => setProfile(prev => ({ ...prev, allowBookings: checked }))}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show Statistics</Label>
                    <p className="text-sm text-muted">Display stream counts and stats</p>
                  </div>
                  <Switch
                    checked={profile.showStats}
                    onCheckedChange={(checked) => setProfile(prev => ({ ...prev, showStats: checked }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="cyber-card">
              <CardHeader>
                <CardTitle className="text-lg">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profile.website}
                    onChange={(e) => setProfile(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="recordLabel">Record Label</Label>
                  <Input
                    id="recordLabel"
                    value={profile.recordLabel}
                    onChange={(e) => setProfile(prev => ({ ...prev, recordLabel: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                
                <div>
                  <Label htmlFor="managementContact">Management Contact</Label>
                  <Input
                    id="managementContact"
                    value={profile.managementContact}
                    onChange={(e) => setProfile(prev => ({ ...prev, managementContact: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="text-lg">Export & Backup</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button variant="outline" className="cyber-button-secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Export Profile Data
                </Button>
                <Button variant="outline" className="cyber-button-secondary">
                  <Upload className="w-4 h-4 mr-2" />
                  Import Profile Data
                </Button>
                <Button variant="outline" className="cyber-button-secondary">
                  <Share2 className="w-4 h-4 mr-2" />
                  Generate Share Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ArtistBioManager;
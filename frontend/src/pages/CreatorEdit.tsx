import { useEffect, useState } from 'react';

import {
  Star,
  Eye,
  TrendingUp,
  BookOpen,
  Calendar,
  Award,
  Users,
  ArrowLeft,
  Edit,
  Save,
  X,
  Plus,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  partialCreatorPostSchema,
  type CreatorPostDTO,
  type CreatorPreviewDTO,
} from '@trainwithx/shared';
import { toast } from '@frontend/hooks/use-toast';
import { useSmartNavigate } from '@frontend/hooks/useSmartNavigate';
import { useAuth } from '@frontend/context/AuthContext';
import { handleThrowAppError } from '@frontend/lib/AppErrorUtils.ts';

const CreatorEdit = () => {
  const { refreshUser } = useAuth();

  const { goToCreator } = useSmartNavigate();
  const [creator, setCreator] = useState<CreatorPreviewDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Edit states
  const [editingBio, setEditingBio] = useState(false);
  const [editingSpecialties, setEditingSpecialties] = useState(false);
  const [editingCertifications, setEditingCertifications] = useState(false);
  const [editingAchievements, setEditingAchievements] = useState(false);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [editingProfile, setEditingProfile] = useState(false);
  const [editingImages, setEditingImages] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form states
  const [formData, setFormData] = useState<CreatorPostDTO>({
    achievements: [],
    bio: '',
    certifications: [],
    specialties: [],
    username: '',
    yearsXP: 0,
    subdomain: '',
  }); //some initial values so it doesn't have to be | null

  // New item states
  const [newSpecialty, setNewSpecialty] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newAchievement, setNewAchievement] = useState('');

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  useEffect(() => {
    const abort = new AbortController();

    const fetchCreator = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/v1/creators/me', {
          signal: abort.signal,
          credentials: 'include',
        });

        if (!res.ok) {
          const { error } = await res.json();
          throw new Error(error || `Request failed: ${res.status}`);
        }

        const c: CreatorPreviewDTO = await res.json();
        setCreator(c);
        setFormData({
          bio: c.bio,
          subdomain: c.subdomain,
          achievements: c.achievements,
          certifications: c.certifications,
          instagram: c.instagram,
          specialties: c.specialties,
          username: c.username,
          yearsXP: c.yearsXP,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message ?? 'You are not a creator');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCreator();
    return () => abort.abort();
  }, []);

  if (!formData) {
    return <>Error fetching creator</>;
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <p className='text-muted-foreground'>Loading…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <p className='text-muted-foreground'>Error: {error}</p>
      </div>
    );
  }
  if (!creator) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-background'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold mb-2'>Creator not found</h2>
          <p className='text-muted-foreground'>
            The creator you're looking for doesn't exist.
          </p>
        </div>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const handleSaveBio = async () => {
    await handleSaveApi({ bio: formData.bio });
    setEditingBio(false);
  };

  const handleSaveSpecialties = async () => {
    await handleSaveApi({ specialties: formData.specialties });
    setEditingSpecialties(false);
  };

  const handleSaveCertifications = async () => {
    await handleSaveApi({ certifications: formData.certifications });
    setEditingCertifications(false);
  };

  const handleSaveAchievements = async () => {
    await handleSaveApi({ achievements: formData.achievements });
    setEditingAchievements(false);
  };

  const handleSaveProfile = async () => {
    await handleSaveApi({
      username: formData.username,
      yearsXP: formData.yearsXP,
      instagram: formData.instagram,
      subdomain: formData.subdomain,
    });
    setEditingProfile(false);
  };

  const handleSaveApi = async (payload: Partial<CreatorPostDTO>) => {
    try {
      // ✅ Local Zod validation before hitting API
      const parsed = partialCreatorPostSchema.safeParse(payload);
      if (!parsed.success) {
        const errorMsg =
          parsed.error.issues?.[0]?.message ||
          'Invalid input. Please check your data.';
        throw new Error(errorMsg);
      }
      const res = await fetch('/api/v1/creators/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        // ✅ Throw unified app error
        throw await handleThrowAppError(res);
      }

      const updated = await res.json();
      setCreator((prev) => (prev ? { ...prev, ...updated } : updated));

      toast({
        title: 'Update successful',
        description: 'Your profile has been updated.',
        variant: 'default',
        className: 'bg-green-100',
      });

      setUploadError('');
    } catch (err: any) {
      console.error('[API Error]', err);

      toast({
        title: 'Update Failed',
        description:
          err.message || 'Something went wrong while saving your changes.',
        variant: 'destructive',
      });

      setUploadError(err.message);
    }
  };

  const addSpecialty = () => {
    if (
      newSpecialty.trim() &&
      !formData.specialties.includes(newSpecialty.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, newSpecialty.trim()],
      }));
      setNewSpecialty('');
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    if (
      newCertification.trim() &&
      !formData.certifications.includes(newCertification.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        certifications: [...prev.certifications, newCertification.trim()],
      }));
      setNewCertification('');
    }
  };

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const addAchievement = () => {
    if (
      newAchievement.trim() &&
      !formData.achievements.includes(newAchievement.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()],
      }));
      setNewAchievement('');
    }
  };

  const removeAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const handleBack = () => {
    window.history.back();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent, type: 'avatar' | 'cover') => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((file) => file.type.startsWith('image/'));

    if (!imageFile) {
      alert('Please drop an image file');
      return;
    }

    // Create a fake event to reuse existing handlers
    const fakeEvent = {
      target: { files: [imageFile] },
    } as any as React.ChangeEvent<HTMLInputElement>;

    if (type === 'avatar') {
      handleAvatarFileChange(fakeEvent);
    } else {
      handleCoverFileChange(fakeEvent);
    }
  };
  // // Add these helper functions before the return statement
  const handleAvatarFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setAvatarPreview(e.target?.result as string);
      setAvatarFile(file);
    };
    reader.readAsDataURL(file);
  };

  const handleCoverFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setCoverPreview(e.target?.result as string);
      setCoverFile(file);
    };
    reader.readAsDataURL(file);
  };
  const handleAvatarSave = async () => {
    if (!avatarFile) {
      alert('Please select an avatar image before saving.');
      return;
    }

    const form = new FormData();
    form.append('avatar', avatarFile);

    try {
      const res = await fetch('/api/v1/users/me/avatar', {
        method: 'PATCH',
        body: form,
        credentials: 'include',
      });

      if (!res.ok) {
        await handleThrowAppError(res);
      }

      const data = await res.json();
      console.log('Avatar uploaded:', data.avatarUrl);
      setCreator((prev) =>
        prev ? { ...prev, avatarUrl: data.avatarUrl } : prev
      );
      setAvatarFile(null);
      await refreshUser();
    } catch (err: any) {
      console.error('Avatar upload failed:', err);
      setUploadError('Failed to upload avatar: ' + 'Unknown error');
      throw err;
    }
  };
  const handleCoverSave = async () => {
    if (!coverFile) {
      alert('Please select a cover image before saving.');
      return;
    }

    const form = new FormData();
    form.append('cover', coverFile); // must match your multer config
    try {
      const res = await fetch('/api/v1/creators/me/cover', {
        method: 'PATCH',
        body: form,
        credentials: 'include',
      });

      if (!res.ok) {
        const err = await res.text();
        throw new Error(err || 'Failed to upload cover.');
      }

      const data = await res.json();
      console.log('Cover uploaded:', data.coverUrl);
      setCreator((prev) =>
        prev ? { ...prev, coverUrl: data.coverUrl } : prev
      );
      setCoverFile(null);
    } catch (err: any) {
      console.error('Cover upload failed:', err);
      setUploadError('Failed to upload cover: ' + 'Unknown error');
      throw err;
    } finally {
    }
  };

  const handleSaveImages = async () => {
    setUploadError('');
    setUploading(true);

    try {
      if (avatarFile) await handleAvatarSave();
      if (coverFile) await handleCoverSave();
      if (!uploadError) setEditingImages(false);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className='min-h-screen bg-background'>
      {/* Hero Section */}
      <div className='relative'>
        {/* Cover Image */}
        <div className='relative h-52 md:h-80 lg:h-88 [@media(min-width:1600px)]:h-[25rem] overflow-hidden'>
          <img
            src={creator.coverUrl || '/default.jpg'}
            alt={`${creator.username} cover`}
            className='w-full h-full object-cover'
          />
          <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent' />

          {/* Back Button */}
          <Button
            variant='ghost'
            className='absolute top-6 left-6 text-white hover:bg-white/20'
            onClick={handleBack}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
        </div>

        {/* Creator Info Section - Below Image */}
        <div className='bg-background border-b'>
          <div className='relative container mx-auto p-4 md:p-8'>
            {/* Edit Images Button */}
            <Button
              variant='secondary'
              className='absolute -top-28 right-4 md:right-8 bg-white/90 hover:bg-white text-black'
              onClick={() => setEditingImages(true)}
            >
              <Edit className='mr-2 h-4 w-4' />
              Edit Images
            </Button>

            {/* Public View button */}
            <Button
              onClick={() =>
                goToCreator({ subdomain: creator.subdomain, newTab: true })
              }
              className='absolute -top-16 right-4 md:right-8 bg-white/90 hover:bg-white text-black border-0'
            >
              <Eye className='h-4 w-4 mr-2' />
              Go Public View
            </Button>

            {/* Mobile Layout */}
            <div className='flex flex-col md:hidden gap-4'>
              <div className='flex items-center gap-4 -mt-12'>
                <Avatar className='h-20 w-20 border-4 border-white shadow-xl bg-background'>
                  <AvatarImage src={creator.avatarUrl} alt={creator.username} />
                  <AvatarFallback className='text-xl font-bold bg-primary text-primary-foreground'>
                    {creator.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 pt-12'>
                  <div className='flex items-center gap-2'>
                    <h1 className='text-2xl font-bold mb-1'>
                      {creator.username}
                    </h1>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setEditingProfile(true)}
                    >
                      <Edit className='h-3 w-3' />
                    </Button>
                  </div>
                  <p className='text-sm text-muted-foreground mb-2'>
                    {creator.subdomain}.trainwithx.com
                  </p>
                </div>
              </div>

              <div className='flex flex-wrap items-center gap-5 text-sm text-muted-foreground'>
                <div className='flex items-center gap-1'>
                  <Calendar className='h-3 w-3' />
                  <span>{creator.yearsXP} years experience</span>
                </div>
                <div className='flex items-center gap-1'>
                  <Users className='h-3 w-3' />
                  <span>
                    Joined {new Date(creator.joinedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className='flex items-center gap-1'>
                  <Star className='h-3 w-3 fill-yellow-400 text-yellow-400' />
                  <span className='font-medium text-foreground'>
                    {Number(creator.avgRating).toFixed(1)}
                  </span>
                  <span>({creator.noReviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className='hidden md:flex flex-col lg:flex-row justify-between items-center gap-6'>
              <div className='flex items-end gap-6 -mt-16'>
                <Avatar className='h-32 w-32 border-4 border-white shadow-xl bg-background'>
                  <AvatarImage src={creator.avatarUrl} alt={creator.username} />
                  <AvatarFallback className='text-3xl font-bold bg-primary text-primary-foreground'>
                    {creator.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className='flex-1 pt-16'>
                  <div className='flex items-center gap-3'>
                    <h1 className='text-4xl font-bold mb-2'>
                      {creator.username}
                    </h1>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => setEditingProfile(true)}
                    >
                      <Edit className='h-4 w-4' />
                    </Button>
                  </div>
                  <p className='text-xl text-muted-foreground mb-3'>
                    {creator.subdomain}.trainwithx.com
                  </p>
                  <div className='flex items-center gap-6 text-muted-foreground'>
                    <div className='flex items-center gap-1'>
                      <Calendar className='h-4 w-4' />
                      <span>{creator.yearsXP} years experience</span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Users className='h-4 w-4' />
                      <span>
                        Joined {new Date(creator.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className='flex items-center gap-1'>
                      <Star className='h-4 w-4 fill-yellow-400 text-yellow-400' />
                      <span className='font-medium text-foreground'>
                        {Number(creator.avgRating).toFixed(1)}
                      </span>
                      <span>({creator.noReviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='container mx-auto p-4 md:p-8'>
        {uploadError && (
          <p className='text-xs text-red-600 mt-1 pb-3'>{uploadError}</p>
        )}
        {/* About and Stats - Side by Side on Desktop */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* About Section */}
          <div className='lg:col-span-2 space-y-8'>
            <Card>
              <CardHeader>
                <div className='flex items-center justify-between'>
                  <CardTitle className='flex items-center gap-2'>
                    <Users className='h-5 w-5' />
                    About {creator.username}
                  </CardTitle>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setEditingBio(true)}
                  >
                    <Edit className='mr-2 h-4 w-4' />
                    Edit Bio
                  </Button>
                </div>
              </CardHeader>
              <CardContent className='space-y-4'>
                {editingBio ? (
                  <div className='space-y-4'>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      rows={6}
                      className='w-full'
                    />
                    <div className='flex gap-2'>
                      <Button onClick={handleSaveBio} size='sm'>
                        <Save className='mr-2 h-4 w-4' />
                        Save
                      </Button>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            bio: creator.bio,
                          }));
                          setEditingBio(false);
                        }}
                      >
                        <X className='mr-2 h-4 w-4' />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className='text-muted-foreground leading-relaxed text-lg'>
                    {creator.bio}
                  </p>
                )}

                {/* Specialties */}
                <div>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-semibold'>Specialties</h4>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setEditingSpecialties(true)}
                    >
                      <Edit className='mr-2 h-3 w-3' />
                      Edit
                    </Button>
                  </div>

                  {editingSpecialties ? (
                    <div className='space-y-4'>
                      <div className='flex gap-2'>
                        <Input
                          value={newSpecialty}
                          onChange={(e) => setNewSpecialty(e.target.value)}
                          placeholder='Add new specialty...'
                          onKeyPress={(e) =>
                            e.key === 'Enter' && addSpecialty()
                          }
                        />
                        <Button onClick={addSpecialty} size='sm'>
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='flex flex-wrap gap-2'>
                        {formData.specialties.map((specialty, index) => (
                          <Badge
                            key={index}
                            variant='secondary'
                            className='px-3 py-1 flex items-center gap-2'
                          >
                            {specialty}
                            <X
                              className='h-3 w-3 cursor-pointer'
                              onClick={() => removeSpecialty(index)}
                            />
                          </Badge>
                        ))}
                      </div>
                      <div className='flex gap-2'>
                        <Button onClick={handleSaveSpecialties} size='sm'>
                          <Save className='mr-2 h-4 w-4' />
                          Save
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              specialties: [...creator.specialties],
                            }));
                            setEditingSpecialties(false);
                          }}
                        >
                          <X className='mr-2 h-4 w-4' />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className='flex flex-wrap gap-2'>
                      {creator.specialties.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant='secondary'
                          className='px-3 py-1'
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Certifications */}
                <div>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-semibold'>Certifications</h4>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setEditingCertifications(true)}
                    >
                      <Edit className='mr-2 h-3 w-3' />
                      Edit
                    </Button>
                  </div>

                  {editingCertifications ? (
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        {formData.certifications.map((cert, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between p-2 bg-muted rounded'
                          >
                            <div className='flex items-center gap-2'>
                              <Award className='h-4 w-4 text-primary' />
                              <span className='text-sm'>{cert}</span>
                            </div>
                            <X
                              className='h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground'
                              onClick={() => removeCertification(index)}
                            />
                          </div>
                        ))}
                      </div>
                      <div className='flex gap-2'>
                        <Input
                          value={newCertification}
                          onChange={(e) => setNewCertification(e.target.value)}
                          placeholder='Add new certification...'
                          onKeyPress={(e) =>
                            e.key === 'Enter' && addCertification()
                          }
                        />
                        <Button onClick={addCertification} size='sm'>
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='flex gap-2'>
                        <Button onClick={handleSaveCertifications} size='sm'>
                          <Save className='mr-2 h-4 w-4' />
                          Save
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              certifications: [...creator.certifications],
                            }));
                            setEditingCertifications(false);
                          }}
                        >
                          <X className='mr-2 h-4 w-4' />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      {creator.certifications.map((cert, index) => (
                        <div key={index} className='flex items-center gap-2'>
                          <Award className='h-4 w-4 text-primary' />
                          <span className='text-sm'>{cert}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Achievements */}
                <div>
                  <div className='flex items-center justify-between mb-3'>
                    <h4 className='font-semibold'>Achievements</h4>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => setEditingAchievements(true)}
                    >
                      <Edit className='mr-2 h-3 w-3' />
                      Edit
                    </Button>
                  </div>

                  {editingAchievements ? (
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        {formData.achievements.map((achievement, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between p-2 bg-muted rounded'
                          >
                            <div className='flex items-center gap-2'>
                              <Star className='h-4 w-4 text-yellow-500' />
                              <span className='text-sm'>{achievement}</span>
                            </div>
                            <X
                              className='h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground'
                              onClick={() => removeAchievement(index)}
                            />
                          </div>
                        ))}
                      </div>
                      <div className='flex gap-2'>
                        <Input
                          value={newAchievement}
                          onChange={(e) => setNewAchievement(e.target.value)}
                          placeholder='Add new achievement...'
                          onKeyPress={(e) =>
                            e.key === 'Enter' && addAchievement()
                          }
                        />
                        <Button onClick={addAchievement} size='sm'>
                          <Plus className='h-4 w-4' />
                        </Button>
                      </div>
                      <div className='flex gap-2'>
                        <Button onClick={handleSaveAchievements} size='sm'>
                          <Save className='mr-2 h-4 w-4' />
                          Save
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              achievements: [...creator.achievements],
                            }));
                            setEditingAchievements(false);
                          }}
                        >
                          <X className='mr-2 h-4 w-4' />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className='space-y-2'>
                      {creator.achievements.map((achievement, index) => (
                        <div key={index} className='flex items-center gap-2'>
                          <Star className='h-4 w-4 text-yellow-500' />
                          <span className='text-sm'>{achievement}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Stats (Read-only) */}
          <div className='hidden lg:block space-y-6'>
            <Card>
              <CardHeader>
                <CardTitle>Creator Stats</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='text-center p-4 bg-muted/50 rounded-lg'>
                    <TrendingUp className='h-6 w-6 mx-auto mb-2 text-primary' />
                    <div className='font-bold text-2xl'>
                      {formatNumber(creator.totalSales)}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Total Sales
                    </div>
                  </div>
                  <div className='text-center p-4 bg-muted/50 rounded-lg'>
                    <BookOpen className='h-6 w-6 mx-auto mb-2 text-primary' />
                    <div className='font-bold text-2xl'>
                      {creator.plansCount}
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      Plans Created
                    </div>
                  </div>
                </div>

                <div className='text-center p-4 bg-muted/50 rounded-lg'>
                  <Star className='h-6 w-6 mx-auto mb-2 text-yellow-500' />
                  <div className='font-bold text-2xl'>
                    {Number(creator.avgRating).toFixed(1)}
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    Average Rating
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editingProfile && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <Card className='w-full max-w-md'>
            <CardHeader>
              <CardTitle>Edit Profile Information</CardTitle>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <Label htmlFor='username'>Username</Label>
                <Input
                  id='username'
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor='subdomain'>Subdomain</Label>
                <Input
                  id='subdomain'
                  value={formData.subdomain}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      subdomain: e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <Label htmlFor='yearsXP'>Years of Experience</Label>
                <Input
                  id='yearsXP'
                  type='number'
                  value={formData.yearsXP}
                  min={0}
                  max={100}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      yearsXP: Number(e.target.value),
                    }))
                  }
                  step={1}
                />
              </div>
              <div>
                <Label htmlFor='instagram'>Instagram Handle</Label>
                <Input
                  id='instagram'
                  value={formData.instagram}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      instagram: e.target.value,
                    }))
                  }
                  placeholder='@username'
                />
              </div>
              <div className='flex gap-2 pt-4'>
                <Button onClick={handleSaveProfile} className='flex-1'>
                  <Save className='mr-2 h-4 w-4' />
                  Save
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      username: creator.username,
                      subdomain: creator.subdomain,
                      yearsXP: creator.yearsXP,
                      instagram: creator.instagram,
                    }));
                    setEditingProfile(false);
                  }}
                  className='flex-1'
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Images Modal */}
      {editingImages && (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
          <Card className='w-full max-w-2xl max-h-[90vh] overflow-y-auto'>
            <CardHeader>
              <CardTitle>Edit Profile Images</CardTitle>
            </CardHeader>
            <CardContent className='space-y-6'>
              {/* Avatar Upload */}
              <div>
                <Label className='text-base font-semibold'>
                  Profile Picture
                </Label>
                <div className='mt-2 space-y-4'>
                  {/* Current/Preview Avatar */}
                  <div className='flex items-center gap-4'>
                    <Avatar className='h-20 w-20'>
                      <AvatarImage
                        src={avatarPreview || creator.avatarUrl || undefined}
                        alt='Avatar preview'
                        className='h-full w-full object-cover object-center'
                      />
                      <AvatarFallback>
                        {formData.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className='text-sm text-muted-foreground'>
                      <p>Recommended: Square image, at least 200x200px</p>
                      <p>Max file size: 10MB</p>
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div
                    className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer'
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'avatar')}
                    onClick={() =>
                      document.getElementById('avatar-upload')?.click()
                    }
                  >
                    <div className='mx-auto h-12 w-12 text-muted-foreground mb-2'>
                      <svg
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 48 48'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1}
                          d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                        />
                      </svg>
                    </div>
                    <p className='text-sm'>
                      <span className='font-medium text-primary'>
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {' '}
                      WEBP, PNG, JPG, JPEG up to 10MB{' '}
                    </p>
                  </div>

                  <input
                    id='avatar-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleAvatarFileChange}
                    className='hidden'
                  />
                </div>
              </div>

              {/* Cover Image Upload */}
              <div>
                <Label className='text-base font-semibold'>Cover Image</Label>
                <div className='mt-2 space-y-4'>
                  {/* Current/Preview Cover */}
                  <div className='space-y-2'>
                    <div className='relative aspect-[3/1] w-full rounded-lg overflow-hidden bg-muted'>
                      <img
                        src={coverPreview || creator.coverUrl || '/default.jpg'}
                        alt='Cover preview'
                        className='h-full w-full object-cover object-center'
                      />
                    </div>
                    <div className='text-sm text-muted-foreground'>
                      <p>Recommended: 1200x400px or similar ratio</p>
                      <p>Max file size: 10MB</p>
                    </div>
                  </div>

                  {/* Upload Area */}
                  <div
                    className='border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer'
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, 'cover')}
                    onClick={() =>
                      document.getElementById('cover-upload')?.click()
                    }
                  >
                    <div className='mx-auto h-12 w-12 text-muted-foreground mb-2'>
                      <svg
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 48 48'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={1}
                          d='M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02'
                        />
                      </svg>
                    </div>
                    <p className='text-sm'>
                      <span className='font-medium text-primary'>
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      WEBP, PNG, JPG, JPEG up to 10MB
                    </p>
                  </div>

                  <input
                    id='cover-upload'
                    type='file'
                    accept='image/*'
                    onChange={handleCoverFileChange}
                    className='hidden'
                  />
                </div>
              </div>
              {uploadError && (
                <p className='text-md text-red-600 mt-1'>{uploadError}</p>
              )}
              <div className='flex gap-2 pt-4'>
                <Button
                  onClick={handleSaveImages}
                  disabled={uploading}
                  className='flex-1'
                >
                  {uploading ? (
                    <>
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className='mr-2 h-4 w-4' />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  variant='outline'
                  onClick={() => {
                    setEditingImages(false);
                    setAvatarPreview(null);
                    setCoverPreview(null);
                    setAvatarFile(null);
                    setCoverFile(null);
                  }}
                  className='flex-1'
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CreatorEdit;

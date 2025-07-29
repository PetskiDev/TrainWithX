import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { TrainWithXLogo } from '@/components/TrainWithXLogo';
import { useAuth } from '@frontend/context/AuthContext';
import {
  sendApplicationSchema,
  type CreatorApplicationDTO,
  type SendApplicationDTO,
} from '@trainwithx/shared';
import { Badge } from '@frontend/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { useSmartNavigate } from '@frontend/hooks/useSmartNavigate';
import { AuthModal } from '@frontend/components/AuthModal';
import {
  handleThrowAppError,
  zodErrorToFieldErrors,
} from '@frontend/lib/AppErrorUtils.ts';

const availableSpecialties = [
  'Strength Training',
  'Bodybuilding & Hypertrophy',
  'HIIT',
  'Fat Loss',
  'Cardio & Endurance',
  'Powerlifting',
  'CrossFit',
  'Home Workouts',
  'Calisthenics',
  'Pilates',
  'Yoga',
  'Running',
  'Bodyweight',
  'Rehab & Recovery',
  "Women's Fitness",
  'Beginner Friendly',
  'Martial Arts',
];
type SendApplicationForm = Omit<SendApplicationDTO, 'agreeToTerms'> & {
  agreeToTerms: boolean;
};

const BecomeCreator = () => {
  const { goPublic } = useSmartNavigate();

  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SendApplicationForm>({
    fullName: '',
    subdomain: '',
    specialties: [],
    experience: 0,
    bio: '',
    socialMedia: '',
    agreeToTerms: false,
    email: '',
  });
  const [customSpecialty, setCustomSpecialty] = useState('');

  const [showLogin, setShowLogin] = useState(!user);
  const [loadingApplication, setLoadingApplication] = useState(false);
  const [existingApplication, setExistingApplication] =
    useState<CreatorApplicationDTO | null>(null);

  const [sendError, setSendError] = useState<string>('');

  useEffect(() => {
    if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [user]);

  useEffect(() => {
    setShowLogin(!user);
  }, [user]);

  if (user?.isCreator) {
    goPublic('/me/creator');
  }
  useEffect(() => {
    if (user) {
      fetchApplication();
    }
  }, [user]);
  const fetchApplication = async () => {
    setLoadingApplication(true);
    try {
      const res = await fetch('/api/v1/creator-application/me', {
        credentials: 'include',
      });

      if (res.ok) {
        const data = await res.json();
        setExistingApplication(data);
      } else if (res.status !== 404) {
        toast({ title: 'Failed to fetch application', variant: 'destructive' });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error loading application', variant: 'destructive' });
    } finally {
      setLoadingApplication(false);
    }
  };
  const handleLoginSuccess = async () => {
    await refreshUser();
    setShowLogin(false); // Close modal manually if user isn't updated instantly
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsed = sendApplicationSchema.safeParse(formData);

    if (!parsed.success) {
      const fieldErrors = zodErrorToFieldErrors<typeof formData>(parsed.error);
      const firstError = Object.values(fieldErrors)[0];
      if (firstError) {
        setSendError(firstError);
      }
      return;
    }

    try {
      const payload = parsed.data;

      const res = await fetch('/api/v1/creator-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        await handleThrowAppError(res);
      }

      toast({
        title: 'Application Submitted!',
        description: "You'll get a notification once we review it.",
      });

      fetchApplication();

      setFormData({
        ...payload,
        fullName: '',
        subdomain: '',
        specialties: [],
        experience: 0,
        bio: '',
        socialMedia: '',
        agreeToTerms: false,
      });

      setCustomSpecialty('');
    } catch (error: any) {
      console.error('Submission error:', error);
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setSendError(`Submission failed: ${error.message}`);
    }
  };

  const addSpecialty = (specialty: string) => {
    if (!formData.specialties.includes(specialty)) {
      setFormData((prev) => ({
        ...prev,
        specialties: [...prev.specialties, specialty],
      }));
    }
  };

  const removeSpecialty = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.filter((s) => s !== specialty),
    }));
  };

  const addCustomSpecialty = () => {
    if (
      customSpecialty.trim() &&
      !formData.specialties.includes(customSpecialty.trim())
    ) {
      addSpecialty(customSpecialty.trim());
      setCustomSpecialty('');
    }
  };
  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (loadingApplication) {
    return (
      <p className='text-center text-muted-foreground'>
        Loading application...
      </p>
    );
  }

  return (
    <div className='min-h-screen-navbar bg-gradient-to-br from-background to-muted/20 py-12'>
      <div className='container mx-auto px-4 max-w-2xl'>
        <div className='text-center mb-8'>
          <div className='flex justify-center mb-4'>
            <TrainWithXLogo size='lg' showText={false} />
          </div>
          <h1 className='text-4xl font-bold mb-4 text-gradient'>
            Become a Creator
          </h1>
          <p className='text-lg text-muted-foreground'>
            Join our community of fitness professionals and share your expertise
            with thousands of users
          </p>
        </div>
        {existingApplication ? (
          <Card className='shadow-xl'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Application Submitted</CardTitle>
                <Badge
                  variant={
                    existingApplication.status === 'approved'
                      ? 'outline'
                      : existingApplication.status === 'rejected'
                      ? 'destructive'
                      : 'secondary'
                  }
                  className='text-sm'
                >
                  Status: {existingApplication.status}
                </Badge>
                {/* should always be pending. Accepted redirects. */}
              </div>
              <CardDescription>
                You’ve already applied. Here’s what you submitted:
              </CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div>
                <strong>Full Name:</strong> {existingApplication.fullName}
              </div>
              <div>
                <strong>Subdomain:</strong> {existingApplication.subdomain}
                .trainwithx.com
              </div>
              <div>
                <strong>Specialties:</strong>{' '}
                {existingApplication.specialties.join(', ')}
              </div>
              <div>
                <strong>Experience:</strong> {existingApplication.experience}{' '}
                years
              </div>
              <div>
                <strong>Bio:</strong> {existingApplication.bio}
              </div>
              <div>
                <strong>Instagram:</strong> @{existingApplication.instagram}
              </div>
              <div>
                <strong>Social Media Links:</strong>{' '}
                {existingApplication.socialMedia}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className='shadow-xl'>
            <CardHeader>
              <CardTitle>Creator Application</CardTitle>
              <CardDescription>
                Apply to become a TrainWithX creator. Your logged-in account
                will be reviewed for approval or rejection, and you'll receive
                notifications about the status.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='grid md:grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='fullName'>Full Name *</Label>
                    <Input
                      id='fullName'
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange('fullName', e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='subdomain'>Wanted Subdomain *</Label>
                    <div className='relative'>
                      <Input
                        id='subdomain'
                        value={formData.subdomain}
                        onChange={(e) =>
                          handleInputChange('subdomain', e.target.value)
                        }
                        placeholder='yourname'
                        className='pr-32'
                        required
                      />
                      <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground'>
                        .trainwithx.com
                      </div>
                    </div>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label>Specialties *</Label>

                  {/* Selected specialties as tags */}
                  {formData.specialties.length > 0 && (
                    <div className='flex flex-wrap gap-2 mb-3'>
                      {formData.specialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant='secondary'
                          className='flex items-center gap-1'
                        >
                          {specialty}
                          <X
                            className='h-3 w-3 cursor-pointer hover:text-destructive'
                            onClick={() => removeSpecialty(specialty)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Available specialties */}
                  <div className='space-y-3'>
                    <div className='flex flex-wrap gap-2'>
                      {availableSpecialties
                        .filter(
                          (specialty) =>
                            !formData.specialties.includes(specialty)
                        )
                        .map((specialty) => (
                          <Badge
                            key={specialty}
                            variant='outline'
                            className='cursor-pointer hover:bg-primary hover:text-primary-foreground'
                            onClick={() => addSpecialty(specialty)}
                          >
                            <Plus className='h-3 w-3 mr-1' />
                            {specialty}
                          </Badge>
                        ))}
                    </div>

                    {/* Add custom specialty */}
                    <div className='flex gap-2'>
                      <Input
                        placeholder='Add custom specialty...'
                        value={customSpecialty}
                        onChange={(e) => setCustomSpecialty(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' &&
                          (e.preventDefault(), addCustomSpecialty())
                        }
                        className='flex-1'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='sm'
                        onClick={addCustomSpecialty}
                        disabled={!customSpecialty.trim()}
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className='grid md:grid-cols-2 gap-4'>
                  {/* Instagram Handle */}
                  <div className='space-y-2'>
                    <Label htmlFor='instagram'>Instagram</Label>
                    <div className='relative'>
                      <Input
                        id='instagram'
                        value={formData.instagram}
                        onChange={(e) =>
                          handleInputChange(
                            'instagram',
                            e.target.value.replace(/^@/, '')
                          )
                        }
                        placeholder='yourhandle'
                        className='pl-7'
                      />
                      <span className='absolute left-2 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground'>
                        @
                      </span>
                    </div>
                  </div>

                  {/* Years of Experience */}
                  <div className='space-y-2'>
                    <Label htmlFor='experience'>Years of Experience *</Label>
                    <Select
                      onValueChange={(value) =>
                        handleInputChange('experience', Number(value))
                      }
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Select your experience level' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='2'>1–2 years</SelectItem>
                        <SelectItem value='4'>3–5 years</SelectItem>
                        <SelectItem value='8'>6–10 years</SelectItem>
                        <SelectItem value='10'>10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='bio'>Professional Bio *</Label>
                  <Textarea
                    id='bio'
                    placeholder='Tell us about your background, training philosophy, and what makes you unique as a fitness professional...'
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    className='min-h-[120px]'
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='socialMedia'>Social Media Links</Label>
                  <Textarea
                    id='socialMedia'
                    placeholder='Share your Instagram, YouTube, TikTok, or website links'
                    value={formData.socialMedia}
                    onChange={(e) =>
                      handleInputChange('socialMedia', e.target.value)
                    }
                    className='min-h-[80px]'
                  />
                </div>

                <div className='flex items-center space-x-2'>
                  <Checkbox
                    id='terms'
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        agreeToTerms: checked as boolean,
                      }))
                    }
                  />
                  <Label htmlFor='terms' className='text-sm'>
                    I agree to the{' '}
                    <button
                      type='button'
                      onClick={() => goPublic('/creator-agreement', true)}
                      className='underline bg-transparent border-none p-0 cursor-pointer'
                    >
                      TrainWithX Creator Agreement
                    </button>{' '}
                    and{' '}
                    <button
                      type='button'
                      onClick={() => goPublic('/terms-of-service', true)}
                      className='underline bg-transparent border-none p-0 cursor-pointer'
                    >
                      Terms & Conditions
                    </button>
                    , and understand that my application will be reviewed *
                  </Label>
                </div>
                {sendError && (
                  <p className='text-sm text-red-600'>{`${sendError}`}</p>
                )}

                <Button
                  type='submit'
                  className='w-full gradient-bg text-white hover:opacity-90'
                  size='lg'
                >
                  Submit Application
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
      <div className='absolute left-0 right-0 top-10 z-50 flex justify-center'>
        <AuthModal
          open={showLogin}
          onClose={() => {
            alert('You must be logged in to become a creator!');
          }}
          onSuccess={handleLoginSuccess}
          redirectUrl={`${window.location.origin}${window.location.pathname}`}
        />
      </div>
    </div>
  );
};

export default BecomeCreator;

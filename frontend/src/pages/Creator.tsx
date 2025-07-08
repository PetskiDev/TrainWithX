// src/pages/Creator.tsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PlansGrid from '../components/PlansGrid';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart, Mail, Award, TrendingUp } from 'lucide-react';
import type { CreatorPreviewDTO } from '@shared/types/creator'; // adjust path if needed
import type { PlanPreview } from '@shared/types/plan';

// ────────────────────────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────────────────────────
const Creator = () => {
  const { subdomain } = useParams<'subdomain'>();
  const [plans, setPlans] = useState<PlanPreview[]>([]);
  //const navigate = useNavigate();
  const [creator, setCreator] = useState<CreatorPreviewDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //TODO: fetch them and store
  const specialties = ['Work', 'Travel'];

  // ───────────── Fetch creator ─────────────
  useEffect(() => {
    if (!subdomain) return;

    const abort = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/v1/creators/${subdomain}`, {
          signal: abort.signal,
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data: CreatorPreviewDTO = await res.json();
        setCreator(data);

        // Fetch plans for this creator
        const planRes = await fetch(`/api/v1/creators/${subdomain}/plans`, {
          signal: abort.signal,
        });
        if (!planRes.ok)
          throw new Error(`Plans fetch failed: ${planRes.status}`);
        const plansData: PlanPreview[] = await planRes.json();
        setPlans(plansData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message ?? 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => abort.abort();
  }, [subdomain]);

  // ───────────── Helpers ─────────────
  //const handlePlanClick = (planId: number) => navigate(`/plans/${planId}`);
  const handleContactClick = () => {
    window.location.href = `mailto:${creator?.username}@example.com`;
  };

  // ───────────── Render logic ─────────────
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-destructive">Error: {error}</p>
      </div>
    );

  if (!creator)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Creator not found</h2>
          <p className="text-muted-foreground">
            The creator you’re looking for doesn’t exist.
          </p>
        </div>
      </div>
    );

  // ───────────── UI ─────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Cover */}
      {creator.coverUrl && (
        <div className="relative h-[300px] overflow-hidden">
          <img
            src={creator.coverUrl}
            alt={`${creator.username} cover`}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Profile */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
          {/* Avatar */}
          <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
            <AvatarImage src={creator.avatarUrl} alt={creator.username} />
            <AvatarFallback className="text-2xl font-bold">
              {creator.username
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {creator.username}
            </h1>
            {creator.bio && (
              <p className="text-lg md:text-xl mb-6 text-muted-foreground max-w-2xl">
                {creator.bio}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">
                  {creator.noBuys.toLocaleString()}
                </span>
                <span className="text-sm text-muted-foreground">
                  Plans Sold
                </span>
              </div>
              {creator.rating !== undefined && (
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">{creator.rating}</span>
                  <span className="text-sm text-muted-foreground">rating</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-muted-foreground" />
                <span className="font-semibold">
                  {creator.yearsXP ?? 'N/A'}
                </span>
                <span className="text-sm text-muted-foreground">
                  years experience
                </span>
              </div>
            </div>

            {/* Specialties */}
            <div className="flex flex-wrap gap-2 mb-6">
              {specialties.map((s, i) => (
                <Badge key={i} variant="secondary">
                  {s}
                </Badge>
              ))}
            </div>

            {/* Contact */}
            <Button onClick={handleContactClick} size="lg" className="px-8">
              <Mail className="h-5 w-5 mr-2" />
              Contact Creator
            </Button>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard
            icon={<TrendingUp className="h-6 w-6 text-primary" />}
            value={creator.noBuys.toLocaleString()}
            label="Plans Sold"
          />
          <StatCard
            icon={<Star className="h-6 w-6 text-primary" />}
            value={creator.rating ? `${creator.rating}/5` : 'N/A'}
            label="Average Rating"
          />
          <StatCard
            icon={<Award className="h-6 w-6 text-primary" />}
            value={creator.plansCount}
            label="Plans Created"
          />
        </div>

        {/* Plans */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Made By {creator.username}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover {creator.username}&rsquo;s comprehensive training
              programs designed to help you achieve your fitness goals
            </p>
          </div>
          <PlansGrid plans={plans} />
        </div>
      </div>
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────────────
// Small helper component for stats
// ────────────────────────────────────────────────────────────────────────────
const StatCard = ({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) => (
  <Card className="text-center hover:shadow-lg transition-shadow">
    <CardContent className="p-6">
      <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2">{value}</h3>
      <p className="text-muted-foreground">{label}</p>
    </CardContent>
  </Card>
);

export default Creator;

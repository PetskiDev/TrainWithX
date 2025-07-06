import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreatePlanDto } from '@shared/types/plan';
import type { CreatorPreview } from '@shared/types/creator';

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { TrainWithXLogo } from '@/components/TrainWithXLogo';

function CreatePlanPage() {
  const [form, setForm] = useState<CreatePlanDto>({
    title: '',
    description: '',
    slug: '',
    price: NaN,
    originalPrice: undefined,
    creatorId: 0,
  });

  const [creators, setCreators] = useState<CreatorPreview[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/v1/creators');
        if (!res.ok) throw new Error('Failed to load creators');
        const data: CreatorPreview[] = await res.json();
        setCreators(data);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'originalPrice'
          ? parseFloat(value)
          : name === 'creatorId'
          ? parseInt(value, 10)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/plans/admin/createplan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const { error } = await res.json();
        throw new Error(error || 'Could not create plan');
      }

      navigate('/plans');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <TrainWithXLogo size="md" />
          </div>
          <CardTitle className="text-2xl font-bold">Create New Plan</CardTitle>
          <CardDescription>
            Add a new fitness plan for a creator
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Creator select */}
            <div className="space-y-2">
              <Label htmlFor="creatorId">Creator</Label>
              <select
                id="creatorId"
                name="creatorId"
                value={form.creatorId || ''}
                onChange={handleChange}
                required
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>
                  Select a creator
                </option>
                {creators.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.username} ({c.subdomain})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Plan title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the plan"
                value={form.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                placeholder="plan-title-slug"
                value={form.slug}
                onChange={handleChange}
                required
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="49.99"
                value={isNaN(form.price) ? '' : form.price}
                onChange={handleChange}
                required
              />
            </div>

            {/* Original Price */}
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (optional)</Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                step="0.01"
                min="0"
                placeholder="99.99"
                value={form.originalPrice ?? ''}
                onChange={handleChange}
              />
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading || !form.creatorId}
              className="w-full"
            >
              {loading ? 'Creating…' : 'Create Plan'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default CreatePlanPage;

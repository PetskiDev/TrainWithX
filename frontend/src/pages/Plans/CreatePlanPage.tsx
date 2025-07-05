import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { CreatePlanDto } from '@shared/types/plan';

import type { CreatorPreview } from '@shared/types/creator';

function CreatePlanPage() {
  // ---------------------------
  // 🗂️  State
  // ---------------------------
  const [form, setForm] = useState<CreatePlanDto>({
    title: '',
    description: '',
    slug: '',
    price: NaN,
    originalPrice: undefined,
    creatorId: 0, // now part of CreatePlanDto
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [creators, setCreators] = useState<CreatorPreview[]>([]);
  const navigate = useNavigate();

  // ---------------------------
  // 🌐 Fetch creators on mount
  // ---------------------------
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

  // ---------------------------
  // 🔄 Handle controlled inputs
  // ---------------------------
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

  // ---------------------------
  // 🚀 Submit new plan to API
  // ---------------------------
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

  // ---------------------------
  // 🖼️  Render
  // ---------------------------
  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <h2>Create New Plan</h2>

        {/* Creator select */}
        <select
          name="creatorId"
          value={form.creatorId || ''}
          onChange={handleChange}
          required
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

        <input
          type="text"
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={4}
          required
          className="plan-textarea"
        />

        <input
          type="text"
          name="slug"
          placeholder="Slug (unique)"
          value={form.slug}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price (e.g. 49.99)"
          step="0.01"
          min="0"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="originalPrice"
          placeholder="Original Price (optional)"
          step="0.01"
          min="0"
          value={form.originalPrice ?? ''}
          onChange={handleChange}
        />

        {error && <p className="error-msg">{error}</p>}

        <button type="submit" disabled={loading || !form.creatorId}>
          {loading ? 'Creating…' : 'Create Plan'}
        </button>
      </form>
    </div>
  );
}

export default CreatePlanPage;

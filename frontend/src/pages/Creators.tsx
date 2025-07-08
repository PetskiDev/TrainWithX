// src/pages/Creators.tsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreatorCard } from '@/components/CreatorCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import type { CreatorPreviewDTO } from '@shared/types/creator';

const Creators = () => {
  const navigate = useNavigate();

  // loading / data / error state
  const [creators, setCreators] = useState<CreatorPreviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const abort = new AbortController();

    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/v1/creators', { signal: abort.signal });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        const data: CreatorPreviewDTO[] = await res.json();
        setCreators(data);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(err.message ?? 'Unknown error');
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => abort.abort();
  }, []);

  const filteredCreators = creators.filter(
    (c) =>
      c.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.bio ?? '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatorClick = (subdomain: string) => {
    navigate(`/creator/${subdomain}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header & search */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Fitness Creators</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Discover amazing fitness creators and their expert training programs
          </p>

          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content */}
        {loading && (
          <p className="text-center text-muted-foreground">Loading…</p>
        )}
        {error && (
          <p className="text-center text-destructive">
            Couldn’t load creators: {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCreators.map((creator) => (
                <div
                  key={creator.id}
                  onClick={() => handleCreatorClick(creator.subdomain)}
                >
                  <CreatorCard {...creator} />
                </div>
              ))}
            </div>

            {filteredCreators.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                  No creators found
                </h3>
                <p className="text-muted-foreground">
                  Try adjusting your search terms
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Creators;

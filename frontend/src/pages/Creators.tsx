// src/pages/Creators.tsx
import { useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Filter, Search, SortAsc } from 'lucide-react';
import type { CreatorPreviewDTO } from '@trainwithx/shared';
import CreatorCard from '@frontend/components/CreatorCard';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@frontend/components/ui/select';
import { useSmartNavigate } from '@frontend/hooks/useSmartNavigate';

const specialties = [
  'All',
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

const sortOptions = [
  { label: 'Most Sales', value: 'sales' },
  { label: 'Highest Rating', value: 'rating' },
  { label: 'Most Experience', value: 'experience' },
  { label: 'Most Plans', value: 'plans' },
  { label: 'A–Z', value: 'alphabetical' },
];

const Creators = () => {
  const { goToCreator } = useSmartNavigate();

  // loading / data / error state
  const [creators, setCreators] = useState<CreatorPreviewDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState('');

  const [sortBy, setSortBy] = useState('sales');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAndSortedCreators = useMemo(() => {
    const filtered = creators.filter((creator) => {
      const search = searchTerm.toLowerCase();

      const matchesSearch =
        creator.username.toLowerCase().includes(search) ||
        creator.subdomain.toLowerCase().includes(search) ||
        creator.bio.toLowerCase().includes(search) ||
        creator.specialties.some((specialty) =>
          specialty.toLowerCase().includes(search)
        );

      const matchesCategory =
        selectedCategory === 'All' ||
        creator.specialties.some((specialty) =>
          specialty.toLowerCase().includes(selectedCategory.toLowerCase())
        ) ||
        creator.specialties.some((specialty) =>
          selectedCategory.toLowerCase().includes(specialty.toLowerCase())
        );
      return matchesSearch && matchesCategory;
    });
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'sales':
          return b.totalSales - a.totalSales;
        case 'rating':
          return b.avgRating - a.avgRating;
        case 'experience':
          return b.yearsXP - a.yearsXP;
        case 'plans':
          return b.plansCount - a.plansCount;
        case 'alphabetical':
        default:
          return a.username.localeCompare(b.username);
      }
    });
    return filtered;
  }, [creators, searchTerm, selectedCategory, sortBy]);

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

  const handleCreatorClick = (subdomain: string) => {
    goToCreator({ subdomain });
  };

  return (
    <div className="min-h-screen-navbar bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header & search */}

        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Fitness Creators
          </h1>
          <p className="text-gray-600">
            Discover amazing fitness creators and their expert training programs
          </p>

          <div className="mt-6 bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search creators..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="awefweawfe" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((specialty) => (
                    <SelectItem key={specialty} value={specialty}>
                      {specialty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Results Count */}
              <div className="flex items-center text-sm text-gray-600">
                {filteredAndSortedCreators.length} creator
                {filteredAndSortedCreators.length !== 1 ? 's' : ''} found
              </div>
            </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredAndSortedCreators.map((creator) => (
                <div
                  key={creator.id}
                  onClick={() => handleCreatorClick(creator.subdomain)}
                >
                  <CreatorCard creator={creator} />
                </div>
              ))}
            </div>

            {filteredAndSortedCreators.length === 0 && (
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

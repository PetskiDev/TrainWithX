import { useState, useEffect, useMemo } from 'react';

import { Input } from '@/components/ui/input';
import { Filter, Search, SortAsc } from 'lucide-react';

import type { PlanPreview } from '@shared/types/plan';
import PlansGrid from '@frontend/components/PlansGrid';
import { goPublic } from '@frontend/lib/nav';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';


//TODO: fetch this
const categories = ["All", "Strength", "Cardio", "Yoga", "Bodyweight", "Running", "Functional"]


const sortOptions = [
  { value: "title", label: "Title" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "duration", label: "Duration" },
  { value: "difficulty", label: "Difficulty" },
]


const PlansPage = () => {
  const [plans, setPlans] = useState<PlanPreview[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState("title")
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredAndSortedPlans = useMemo(() => {
    const filtered = plans.filter((plan) => {
      const matchesSearch =
        plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.features.some(feature =>
          feature.toLowerCase().includes(searchTerm.toLowerCase())) ||
        plan.creatorUsername.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || true //TODO SEE IF THE PLAN IS in the category or contains tags
      return matchesSearch && matchesCategory
    })
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "duration":
          return a.duration - b.duration
        case "difficulty":
          const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        default:
          return a.title.localeCompare(b.title)
      }
    })
    return filtered
  }, [plans, searchTerm, selectedCategory, sortBy])

  // Fetch plans from API on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/v1/plans');
        const data = await res.json();
        setPlans(data);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);


  const handlePlanClick = (planId: number) => {
    goPublic(`/plan/${planId}`);
  };



  return (
    <div className="min-h-screen-navbar bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Choose Your Fitness Plan</h1>
          <p className="text-gray-600">Find the perfect workout program to achieve your fitness goals</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search plans..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
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
              {filteredAndSortedPlans.length} plan{filteredAndSortedPlans.length !== 1 ? "s" : ""} found
            </div>
          </div>
        </div>
        {loading ? (
          <p className="text-muted-foreground">Loading plans…</p>
        ) : (
          <PlansGrid
            plans={filteredAndSortedPlans}
            onPlanClick={() => handlePlanClick}
          />
        )}
      </div>
    </div>
  );
};

export default PlansPage;

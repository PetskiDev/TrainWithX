import {
  Star,
  TrendingUp,
  BookOpen,
  Calendar,
  MapPin,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import type { CreatorPreviewDTO } from '@trainwithx/shared';
import { SiInstagram } from 'react-icons/si';
import { useSmartNavigate } from '@frontend/hooks/useSmartNavigate';

export default function CreatorCard({
  creator,
}: {
  creator: CreatorPreviewDTO;
}) {
  const { goToCreator } = useSmartNavigate();

  const handleViewProfile = () => {
    goToCreator({ subdomain: creator.subdomain });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border-0 shadow-md flex flex-col h-full">
      {/* Cover Image Header */}
      <div className="relative h-32 overflow-hidden">
        <img
          src={creator.coverUrl || `/default.jpg`}
          alt={`${creator.username} cover`}
          width={400}
          height={128}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Profile Views Badge */}
        {/* <Badge className="absolute top-3 right-3 bg-black/50 text-white border-0">
          <Eye className="h-3 w-3 mr-1" />
          {formatNumber(creator.profileViews)}
        </Badge> */}
      </div>

      {/* Avatar positioned over cover */}
      <div className="relative flex items-end gap-3 px-5 -mt-8">
        {/* Instagram logo */}
        {creator.instagram && (
          <a
            href={`https://instagram.com/${creator.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-10 h-10 absolute top-11 right-5 z-[1000] text-muted-foreground hover:text-foreground transition [@media(max-width:370px)]:-top-3 [@media(max-width:370px)]:text-white"
          >
            <SiInstagram className="w-5 h-5" />
          </a>
        )}

        <Avatar className="h-24 w-24 border-4 border-white shadow-lg">
          <AvatarImage src={creator.avatarUrl} alt={creator.username} />
          <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
            {creator.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Creator Info */}
        <div className="relative -top-2">
          <h3 className="font-bold text-2xl leading-tight group-hover:text-primary transition-colors">
            {creator.username}
          </h3>
          <p className="text-sm text-muted-foreground">
            {creator.subdomain}.trainwithx.com
          </p>
        </div>
      </div>

      <CardContent className="p-5 pt-3 flex-grow flex flex-col justify-between">
        <div className="space-y-4">
          {/* Bio */}
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {creator.bio}
          </p>

          {/* Specialties */}
          {creator.specialties.length > 0 && (
            <div className="px-1 flex items-center gap-2 overflow-hidden">
              <div className="flex gap-2 overflow-hidden max-w-full">
                {(() => {
                  const maxSpecialtiesToShow = Math.min(
                    3,
                    creator.specialties.length
                  );
                  const specialtiesToShow = creator.specialties.slice(
                    0,
                    maxSpecialtiesToShow
                  );
                  const remainingCount =
                    creator.specialties.length - maxSpecialtiesToShow;

                  return (
                    <>
                      {specialtiesToShow.map((specialty, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-secondary text-xs px-2 py-0.5 whitespace-nowrap flex-shrink-0"
                        >
                          {specialty}
                        </Badge>
                      ))}
                      {remainingCount > 0 && (
                        <Badge
                          variant="outline"
                          className="bg-secondary text-xs px-2 py-0.5 whitespace-nowrap flex-shrink-0"
                        >
                          +{remainingCount}
                        </Badge>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 space-y-4">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 py-3 border-t border-b">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <TrendingUp className="h-4 w-4" />
                <span className="text-xs">Sales</span>
              </div>
              <div className="font-bold text-lg">
                {formatNumber(creator.totalSales)}
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs">Plans</span>
              </div>
              <div className="font-bold text-lg">{creator.plansCount}</div>
            </div>
          </div>

          {/* Experience & Rating */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>{creator.yearsXP} years exp</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">
                {Number(creator.avgRating).toFixed(1)}
              </span>
              <span className="text-muted-foreground">
                ({creator.noReviews})
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleViewProfile}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
          >
            <div className="flex items-center justify-between w-full">
              <span>View Profile</span>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </div>
          </Button>

          {/* Trust Signal */}
          <div className="!mt-2 text-center">
            <span className="text-xs text-muted-foreground">
              ✓ Verified Creator
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

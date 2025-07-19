import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { CreatorPreviewDTO } from '@shared/types/creator';
import { Star, ShoppingCart } from 'lucide-react';

export const CreatorCard = ({
  username,
  bio,
  avatarUrl,
  avgRating,
  noReviews,
  plansCount,
  totalSales,
}: CreatorPreviewDTO) => {
  return (
    <Card
      className="hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => { }}
    >
      <CardHeader className="text-center">
        <Avatar className="w-16 h-16 mx-auto mb-4">
          <AvatarImage src={avatarUrl} alt={username} />
          <AvatarFallback>
            {username
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </AvatarFallback>
        </Avatar>
        <CardTitle>{username}</CardTitle>
        <CardDescription className="line-clamp-2">{bio}</CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ShoppingCart className="h-4 w-4" />
            <span>{totalSales}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span>{avgRating} ({noReviews} reviews)</span> 
          </div>
        </div>
        <Badge variant="secondary">{plansCount} plans</Badge>
        <Button className="w-full">View Profile</Button>
      </CardContent>
    </Card>
  );
};

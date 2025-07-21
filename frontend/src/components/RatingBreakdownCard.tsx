import { useMemo, type FC } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

type Review = {
    rating: number
}

interface RatingBreakdownCardProps {
    reviews: Review[]
}

export const RatingBreakdownCard: FC<RatingBreakdownCardProps> = ({ reviews }) => {
    const totalReviews = reviews.length;
    const breakdown = useMemo(() => {
        return [5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => r.rating === stars).length
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
            return { stars, count, percentage }
        })
    }, [reviews, totalReviews])

    return (
        <Card>
            <CardHeader>
                <CardTitle>Reviews ({totalReviews})</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {breakdown.map(({ stars, count, percentage }) => (
                        <div key={stars} className="flex items-center gap-3">
                            <span className="text-sm font-medium w-12">{stars} Stars</span>
                            <Progress value={percentage} className="flex-1 h-2" />
                            <span className="text-sm text-muted-foreground w-8">({count})</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

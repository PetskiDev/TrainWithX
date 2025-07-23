import { Star, Clock, Dumbbell, Users, Shield } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { PlanPreview } from "@shared/types/plan"
import { Button } from "@frontend/components/ui/button"
import { useSmartNavigate } from "@frontend/hooks/useSmartNavigate"


interface PlanCardProps {
  plan?: PlanPreview
  showCreator?: boolean
}

const difficultyColors = {
  beginner: "bg-green-100 text-green-800 border-green-200",
  intermediate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  advanced: "bg-red-100 text-red-800 border-red-200",
}

export default function PlanCardNew({ plan, showCreator = false }: PlanCardProps) {
  const { goToCreator } = useSmartNavigate();

  if (!plan) return null // nothing to render yet

  // const safeTags = ['tag1', 'TODO'];

  const hasDiscount = plan.originalPrice && plan.originalPrice > plan.price
  const discountPercentage = hasDiscount
    ? Math.round(((plan.originalPrice! - plan.price) / plan.originalPrice!) * 100)
    : 0

  const handleGetThisPlan = async (plan: PlanPreview) => {
    goToCreator({ subdomain: plan.creatorSubdomain, path: `/${plan.slug}` })
  }

  return (
    <Card className="relative group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm flex flex-col flex-space-between h-full">
      <div className="relative">
        <div className="aspect-video overflow-hidden">
          <img
            src={plan.coverImage || `/default.jpg`}
            alt={plan.title}
            width={350}
            height={200}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {hasDiscount && (
            <Badge className="absolute top-3 right-3 bg-red-500 hover:bg-red-500 text-white font-semibold text-sm text px-3">
              -{discountPercentage}%
            </Badge>
          )}
        </div>
      </div>


      <CardContent className="relative flex-grow flex flex-col justify-between">
        {/* Tags */}
        {/* Show max 3, if still more, overflow */}
        {plan.tags.length > 0 && (
          <div className="absolute -top-8 left-0 right-0 px-4 flex items-center gap-2 overflow-hidden">
            <div className="flex gap-2 overflow-hidden max-w-full">
              {(() => {
                const maxTagsToShow = Math.min(3, plan.tags.length)
                const tagsToShow = plan.tags.slice(0, maxTagsToShow)
                const remainingCount = plan.tags.length - maxTagsToShow

                return (
                  <>
                    {tagsToShow.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="bg-secondary text-xs px-2 py-0.5 whitespace-nowrap flex-shrink-0"
                      >
                        {tag}
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
                )
              })()}
            </div>
          </div>
        )}

        <div className="relative space-y-4 py-3">

          {/* Title */}
          <h3 className="font-semibold text-xl leading-normal line-clamp-3 group-hover:text-primary transition-colors">
            {plan.title}
          </h3>


          {/* Creator Info */}
          {showCreator && (
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={plan.creatorAvatarUrl} alt={plan.creatorUsername} />
                <AvatarFallback className="text-xs">{plan.creatorUsername.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-lg text-muted-foreground">{plan.creatorUsername}</span>
              <span className="text-md text-muted-foreground">• {plan.creatorXp}y exp</span>
            </div>
          )}


          {/* Duration and Workouts Stats */}
          <div className="flex items-center gap-4 text-base text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{plan.duration} weeks</span>
            </div>
            <div className="flex items-center gap-1">
              <Dumbbell className="h-4 w-4" />
              <span>{plan.totalWorkouts} workouts</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-1">
            {plan.features.map((feature, index) => (
              <div key={index} className="text-base text-muted-foreground flex items-center gap-2">
                <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                {feature}
              </div>
            ))}
          </div>



        </div>
        <div className="space-y-4">
          {/* Rating */}

          <div className="flex items-center gap-4 text-base text-muted-foreground mt-2">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">{Number(plan.avgRating).toFixed(1)}</span>
              <span>({plan.noReviews})</span>
            </div>
            <div className="flex items-center gap-1 text-base text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{plan.sales} sold</span>
            </div>
            <Badge
              variant="secondary"
              className={`${difficultyColors[plan.difficulty]} font-medium capitalize ml-auto`}
            >
              {plan.difficulty}
            </Badge>
          </div>

          {/* Price and CTA - Always at bottom */}

          <div className="border-t">
            <div className="flex items-center justify-between h-12 mt-2">
              <div className="flex items-top gap-2">
                <span className="text-3xl font-bold text-primary">${plan.price}</span>
                {hasDiscount && (
                  <span className="text-xl text-red-400 line-through">
                    ${plan.originalPrice}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">You save</span>
                  <div className="text-lg font-semibold text-green-600">
                    ${(plan.originalPrice! - plan.price).toFixed(0)}
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={() => handleGetThisPlan(plan)}
              className="my-2 w-full gradient-bg hover:opacity-90 hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center justify-between">
                <span className="text-lg">Start Training Now</span>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold">{' '}</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </Button>

            <div className="mt-1 flex text-sm items-center justify-between text-center">
              <div className="flex items-center gap-1">
                <Shield className="h-4 w-4 text-green-500" />
                <span>Secure payment</span>
              </div>
              <span className="text-muted-foreground">✓ Instant access</span>

            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  )
}

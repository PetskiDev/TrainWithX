import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, PlayCircle } from "lucide-react";
import type { PlanPreviewWithProgress } from "@shared/types/plan";
import { goToCreator } from "@frontend/lib/nav";


export const PlanOwnedCard = ({ plan }: { plan: PlanPreviewWithProgress }) => {

    const {
        title,
        difficulty,
        creatorUsername,
        progress,
        slug,
        creatorSubdomain,
    } = plan;
    const progressPercentage = Math.round(progress * 100);

    const isCompleted = progress === 1;
    const isStarted = progress > 0;

    const status = isCompleted
        ? "Completed"
        : isStarted
            ? "In Progress"
            : "Not Started";

    const badgeClass = isCompleted
        ? "bg-green-500 hover:bg-green-600"
        : isStarted
            ? "bg-blue-500 hover:bg-blue-600"
            : "bg-gray-500 hover:bg-gray-600";


    const handleClick = () => {
        goToCreator({ subdomain: creatorSubdomain, path: `/${slug}/content` });
    };

    return (
        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col h-full" onClick={handleClick}>
            <div className="relative overflow-hidden">
                <img
                    src={'/plan_images/default.jpg'}
                    alt={title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className={`absolute top-2 right-2 ${badgeClass}`}>
                    {status}
                </Badge>
            </div>

            <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors flex-1">
                        {title}
                    </h3>
                    {difficulty && (
                        <Badge variant={
                            difficulty === "beginner" ? "secondary" :
                                difficulty === "intermediate" ? "default" : "destructive"
                        } className="text-xs">
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </Badge>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">{creatorUsername}</p>
            </CardHeader>

            <CardContent className="pt-0 flex-grow">
            </CardContent>

            <CardFooter className="pt-0 flex flex-col gap-5">
                {/* Progress Section */}
                <div className="w-full space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm text-muted-foreground">{progressPercentage}%</span>
                    </div>
                    <Progress value={progress * 100} className="h-2" />
                </div>

                {/* Button */}
                <Button
                    className="w-full"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleClick();
                    }}
                >
                    {progress === 0 ? (
                        <>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Start Training
                        </>
                    ) : progress === 1 ? (
                        <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Review Training
                        </>
                    ) : (
                        <>
                            <PlayCircle className="h-4 w-4 mr-2" />
                            Continue Training
                        </>
                    )}
                </Button>
            </CardFooter>
        </Card>
    );
};
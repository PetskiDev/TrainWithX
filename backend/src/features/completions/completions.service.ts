import { AppError } from "@src/utils/AppError";
import { prisma } from "@src/utils/prisma";

export async function createCompletion({
    userId,
    planId,
    weekId,
    dayId,
}: { userId: number, planId: number, weekId: number, dayId: number }) {
    try {
        return await prisma.completion.create({
            data: { userId, planId, weekId, dayId },
        });
    } catch (err: any) {
        if (err.code === 'P2002') {
            throw new AppError('Already marked as completed.', 409);
        }
        throw err;
    }
}


export async function getCompletedSet({
    userId,
    planId,
}: { userId: number, planId: number }) {

    const completions = await prisma.completion.findMany({
        where: { userId, planId },
    });

    const completedSet = new Set(
        completions.map((c) => `${c.weekId}-${c.dayId}`)
    );

    return completedSet;
}
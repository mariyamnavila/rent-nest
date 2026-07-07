import { prisma } from "../../lib/prisma";
import { ICreateReviewPayload } from "./review.interface";
import { RequestStatus } from "../../../generated/prisma/enums";

const createReview = async (payload: ICreateReviewPayload, tenantId: string) => {
    const { propertyId, rating, comment } = payload;

    if (rating < 1 || rating > 5) {
        throw new Error("Rating must be between 1 and 5.");
    }

    await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        },
    });

    const completedRental = await prisma.rentalRequest.findFirst({
        where: {
            propertyId,
            tenantId,
            status: RequestStatus.COMPLETED,
        },
    });

    if (!completedRental) {
        throw new Error("You can only review properties where you have a completed rental request.");
    }

    const review = await prisma.review.create({
        data: {
            rating,
            comment,
            propertyId,
            tenantId,
        },
        include: {
            property: true,
            tenant: {
                omit: {
                    password: true,
                },
            },
        },
    });

    return review;
}

export const reviewService = {
    createReview,
}

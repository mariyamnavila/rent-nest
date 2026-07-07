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

    // Count total completed rental requests for this property by this tenant
    const completedRentalsCount = await prisma.rentalRequest.count({
        where: {
            propertyId,
            tenantId,
            status: RequestStatus.COMPLETED,
        },
    });

    if (completedRentalsCount === 0) {
        throw new Error("You can only review properties where you have a completed rental request.");
    }

    // Count total reviews submitted for this property by this tenant
    const reviewsCount = await prisma.review.count({
        where: {
            propertyId,
            tenantId,
        },
    });

    if (reviewsCount >= completedRentalsCount) {
        throw new Error("You have already submitted reviews for all your completed stays of this property.");
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

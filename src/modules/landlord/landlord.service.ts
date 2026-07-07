import { prisma } from "../../lib/prisma";
import { ICreatePropertyPayload } from "./landlord.interface";

const createProperty = async (payload: ICreatePropertyPayload, landlordId: string) => {
    const { categoryId } = payload;

    await prisma.category.findUniqueOrThrow({
        where: {
            id: categoryId,
        },
    });

    const property = await prisma.property.create({
        data: {
            ...payload,
            landlordId,
        },
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true,
                },
            },
        },
    });

    return property;
}

export const landlordService = {
    createProperty,
}

import { prisma } from "../../lib/prisma";
import { ICreatePropertyPayload, TUpdateProperty } from "./landlord.interface";

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

const updateProperty = async (
    propertyId: string,
    landlordId: string,
    payload: TUpdateProperty
) => {
    const property = await prisma.property.findUniqueOrThrow({
        where: {
            id: propertyId,
        },
    });

    if (property.landlordId !== landlordId) {
        throw new Error("You do not have permission to update this property.");
    }

    if (payload.categoryId) {
        await prisma.category.findUniqueOrThrow({
            where: {
                id: payload.categoryId,
            },
        });
    }

    const updatedProperty = await prisma.property.update({
        where: {
            id: propertyId,
        },
        data: payload,
        include: {
            category: true,
            landlord: {
                omit: {
                    password: true,
                },
            },
        },
    });

    return updatedProperty;
}

export const landlordService = {
    createProperty,
    updateProperty,
}

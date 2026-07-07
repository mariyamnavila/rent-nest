import { prisma } from "../../lib/prisma";

const createCategory = async (name: string) => {

    const existingCategory = await prisma.category.findUnique({
        where: {
            name

        },
    });

    if (existingCategory) {
        throw new Error("Category already exists!");
    }

    const result = await prisma.category.create({
        data: {
            name
        },
    });

    return result;
};

const getAllCategories = async () => {

    const result = await prisma.category.findMany({
        orderBy: {
            name: "asc",
        },
    });

    return result
};

export const categoryService = {
    createCategory,
    getAllCategories,
}

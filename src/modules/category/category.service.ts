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

const updateCategory = async (id: string, name: string) => {
    const existingCategory = await prisma.category.findUnique({
        where: { id },
    });

    if (!existingCategory) {
        throw new Error("Category not found.");
    }

    const duplicateCategory = await prisma.category.findFirst({
        where: {
            name,
            NOT: {
                id
            },
        },
    });

    if (duplicateCategory) {
        throw new Error("Category name already exists.");
    }

    const result = prisma.category.update({
        where: {
            id
        },
        data: {
            name
        },
    });

    return result;
};

const deleteCategory = async (id: string) => {

    await prisma.category.findUniqueOrThrow({
        where: { id },
    });

    return await prisma.category.delete({
        where: { id },
    });
};

export const categoryService = {
    createCategory,
    getAllCategories,
    updateCategory,
    deleteCategory,
}

import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { categoryService } from "./category.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createCategory = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    const result = await categoryService.createCategory(name as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Category created successfully",
        data: result
    })
})

const getAllCategories = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const result = await categoryService.getAllCategories();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Categories retrieved successfully",
        data: result
    })
})

export const categoryController = {
    createCategory,
    getAllCategories,
}

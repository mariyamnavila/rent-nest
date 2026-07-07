import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { landlordService } from "./landlord.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const payload = req.body;

    const result = await landlordService.createProperty(payload, landlordId as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property listing created successfully",
        data: result
    })
})

const updateProperty = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const landlordId = req.user?.id;
    const { id } = req.params;
    const payload = req.body;

    const result = await landlordService.updateProperty(id as string, landlordId as string, payload);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Property listing updated successfully",
        data: result
    })
})

export const landlordController = {
    createProperty,
    updateProperty,
}

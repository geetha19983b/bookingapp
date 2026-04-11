"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const vendorService_1 = require("../services/vendorService");
const vendorSchemas_1 = require("../schemas/vendorSchemas");
const router = (0, express_1.Router)();
const asyncHandler = (handler) => {
    return async (req, res, next) => {
        try {
            await handler(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
};
router.post('/', asyncHandler(async (req, res) => {
    const body = (0, vendorSchemas_1.parseBody)(vendorSchemas_1.createVendorBodySchema, req.body);
    const createdVendor = await (0, vendorService_1.createVendor)(body);
    res.status(201).json({
        message: 'Vendor created successfully',
        data: createdVendor,
    });
}));
router.put('/:id', asyncHandler(async (req, res) => {
    const params = (0, vendorSchemas_1.parseParams)(vendorSchemas_1.vendorIdParamsSchema, req.params);
    const body = (0, vendorSchemas_1.parseBody)(vendorSchemas_1.updateVendorBodySchema, req.body);
    const updatedVendor = await (0, vendorService_1.updateVendor)(params.id, body);
    if (!updatedVendor) {
        res.status(404).json({ message: 'Vendor not found' });
        return;
    }
    res.status(200).json({
        message: 'Vendor updated successfully',
        data: updatedVendor,
    });
}));
router.delete('/:id', asyncHandler(async (req, res) => {
    const params = (0, vendorSchemas_1.parseParams)(vendorSchemas_1.vendorIdParamsSchema, req.params);
    const deletedVendor = await (0, vendorService_1.deleteVendor)(params.id);
    if (!deletedVendor) {
        res.status(404).json({ message: 'Vendor not found' });
        return;
    }
    res.status(200).json({
        message: 'Vendor deleted successfully',
        data: deletedVendor,
    });
}));
exports.default = router;

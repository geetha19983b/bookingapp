"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const zod_1 = require("zod");
const vendors_1 = __importDefault(require("./routes/vendors"));
const app = (0, express_1.default)();
const PORT = 5174;
const DATA_FILE = path_1.default.resolve(__dirname, '../items.json');
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express_1.default.json());
app.use('/api/vendors', vendors_1.default);
app.post('/api/items', (req, res) => {
    const item = req.body;
    let items = [];
    if (fs_1.default.existsSync(DATA_FILE)) {
        items = JSON.parse(fs_1.default.readFileSync(DATA_FILE, 'utf8'));
    }
    items.push(item);
    fs_1.default.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2));
    res.status(201).json({ success: true });
});
app.get('/api/items', (_req, res) => {
    let items = [];
    if (fs_1.default.existsSync(DATA_FILE)) {
        items = JSON.parse(fs_1.default.readFileSync(DATA_FILE, 'utf8'));
    }
    res.json(items);
});
app.use((error, _req, res, _next) => {
    if (error instanceof zod_1.ZodError) {
        res.status(400).json({
            message: 'Validation failed',
            errors: error.issues.map((issue) => ({
                path: issue.path.join('.') || 'body',
                message: issue.message,
            })),
        });
        return;
    }
    if (isPgUniqueViolation(error)) {
        res.status(409).json({
            message: 'Duplicate value violates a unique constraint',
            detail: error.detail,
        });
        return;
    }
    console.error('Unhandled error:', error);
    res.status(500).json({
        message: 'Internal server error',
    });
});
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
const isPgUniqueViolation = (value) => {
    if (!value || typeof value !== 'object') {
        return false;
    }
    const maybeError = value;
    return maybeError.code === '23505';
};

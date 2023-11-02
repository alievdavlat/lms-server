"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const mongoose_config_1 = __importDefault(require("./config/mongoose.config"));
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const Routes_1 = __importDefault(require("./routes/Routes"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socketServer_1 = require("./socketServer");
const express_rate_limit_1 = require("express-rate-limit");
const PORT = process.env.PORT || 4000;
const ORIGIN = process.env.ORIGIN;
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
app.set('view engine', 'ejs');
app.use(express_1.default.json({ limit: '50mb' }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express_1.default.static(path_1.default.join(process.cwd(), 'public')));
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});
app.use(Routes_1.default);
app.use(limiter);
app.use(errorHandler_middleware_1.errohandle);
app.get('/', (req, res, next) => {
    res.status(200).send('api is working');
});
// app.all('*', (req:Request, res:Response, next:NextFunction) => {
//   const err = new Error(`Route ${req.originalUrl} not found`) as any;
//   err.statusCode = 404
//   next(err)
// })
(0, socketServer_1.initSocketServer)(server);
server.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
    (0, mongoose_config_1.default)();
});

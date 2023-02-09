"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userLogin = exports.userRegistration = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../../common/config");
const HandlerError_1 = require("../../Errors/HandlerError");
const network_1 = require("../../utils/network");
const User_service_1 = require("./User.service");
const generateToken = (user) => (jsonwebtoken_1.default.sign({
    userId: user.id,
    email: user.email,
}, config_1.envConfig.TOKEN_KEY, {
    expiresIn: '1d'
}));
const userRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = '';
    req.on('data', (chunk) => data += chunk);
    req.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { firstName, lastName, email, password } = JSON.parse(data);
            if (!(email && password && firstName && lastName)) {
                const STATUS_MESSAGE = 'All fields are required';
                res.writeHead(400, STATUS_MESSAGE);
                res.end(STATUS_MESSAGE);
                return;
            }
            const isUserExist = (0, User_service_1.getUser)(email);
            if (isUserExist) {
                const STATUS_MESSAGE = 'The User already exist';
                res.writeHead(409, STATUS_MESSAGE);
                res.end(STATUS_MESSAGE);
                return;
            }
            const encryptedPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = (0, User_service_1.createUser)({
                firstName,
                lastName,
                email,
                password: encryptedPassword,
            });
            user.token = generateToken(user);
            res.writeHead(201, network_1.commonJSONResponseHeaders);
            res.end(JSON.stringify(user));
        }
        catch (err) {
            (0, HandlerError_1.HandleError)(req, res, err);
        }
    }));
});
exports.userRegistration = userRegistration;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let data = '';
    req.on('data', (chunk) => data += chunk);
    req.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = JSON.parse(data);
            if (!(email && password)) {
                const STATUS_MESSAGE = 'All fields are required';
                (0, network_1.sendResponse)({
                    response: res,
                    statusCode: 400,
                    statusMessage: STATUS_MESSAGE,
                });
                return;
            }
            const existedUser = (0, User_service_1.getUser)(email);
            if (!existedUser ||
                !(yield bcryptjs_1.default.compare(password, existedUser.password))) {
                (0, network_1.sendResponse)({
                    response: res,
                    statusCode: 400,
                    statusMessage: 'Invalid credentials',
                });
                return;
            }
            existedUser.token = generateToken(existedUser);
            (0, network_1.sendResponse)({
                response: res,
                statusCode: 200,
                statusMessage: JSON.stringify(existedUser),
            });
        }
        catch (err) {
            (0, HandlerError_1.HandleError)(req, res, err);
        }
    }));
});
exports.userLogin = userLogin;

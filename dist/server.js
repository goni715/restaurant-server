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
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const dbConnect_1 = __importDefault(require("./app/utils/dbConnect"));
let server;
const port = config_1.default.port || 9090;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, dbConnect_1.default)();
            server = app_1.default.listen(port, () => {
                console.log(`Example app listening on port ${port}`);
            });
        }
        catch (error) {
            console.log(error);
        }
    });
}
main();
//asynchronous code error
process.on('unhandledRejection', (err) => {
    console.log(`❤❤ unahandledRejection is detected , shutting down ...`, err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
//synchronous code error--process immediately off
process.on('uncaughtException', () => {
    console.log(`😛😛 uncaughtException is detected , shutting down ...`);
    process.exit(1);
});

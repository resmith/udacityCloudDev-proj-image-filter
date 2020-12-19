"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const util_1 = require("./util/util");
const path_1 = __importDefault(require("path"));
(() => __awaiter(this, void 0, void 0, function* () {
    let mime = {
        html: 'text/html',
        txt: 'text/plain',
        css: 'text/css',
        gif: 'image/gif',
        jpg: 'image/jpeg',
        png: 'image/png',
        svg: 'image/svg+xml',
        js: 'application/javascript'
    };
    // Init the Express application
    const app = express_1.default();
    // Set the network port
    const port = process.env.PORT || 8082;
    // Use the body parser middleware for post requests
    app.use(body_parser_1.default.json());
    app.use(express_1.default.static('public'));
    // Use to serve static assets (images)
    app.get("/filteredimage", (req, res) => __awaiter(this, void 0, void 0, function* () {
        let { image_url } = req.query;
        if (!image_url) {
            res.status(422);
            return res.send(`No image url supplied`);
        }
        const outpath = yield util_1.filterImageFromURL(image_url);
        let extensions = outpath.split(".");
        let extension = extensions[extensions.length - 1];
        let type = mime['jpg'] || 'text/plain';
        // res.send("Hello from Bobby3")
        res.sendFile(path_1.default.resolve(outpath), function (err) {
            if (err) {
                console.log("sendFile error: ", err);
            }
            else {
                console.log("sent file: ", outpath);
                util_1.deleteLocalFiles([outpath]);
            }
        });
        // Another option for sending the image file
        //   var s = fs.createReadStream(outpath);
        //   s.on('open', function () {
        //       res.set('Content-Type', type);
        //       s.pipe(res);
        //   });
        //   s.on('close', function () {
        //     res.set('Content-Type', type);
        //     s.pipe(res);
        // });
        //   s.on('error', function () {
        //       res.set('Content-Type', 'text/plain');
        //       res.status(404).end('Not found');
        //   });
    }));
    // Root Endpoint
    // Displays a simple message to the user
    app.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
        res.send("try GET /filteredimage?image_url={{}}");
    }));
    // Start the Server
    app.listen(port, () => {
        console.log(`server running http://localhost:${port}`);
        console.log(`press CTRL+C to stop server`);
    });
}))();
//# sourceMappingURL=server.js.map
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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const firestore_1 = require("firebase/firestore");
const app_1 = require("firebase/app");
const firestore_2 = require("firebase/firestore");
dotenv_1.default.config();
const arraySize = 5;
const port = process.env.PORT || 8000;
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID
};
const firebaseApp = (0, app_1.initializeApp)(firebaseConfig);
const db = (0, firestore_2.getFirestore)(firebaseApp);
const app = (0, express_1.default)();
app.listen(port, () => {
    console.log(`port started ${port}`);
});
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hi");
});
app.post("/user_exists", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username } = req.body;
        console.log(username);
        const docRef = (0, firestore_1.doc)(db, "user", username);
        const docSnap = yield (0, firestore_1.getDoc)(docRef);
        if (docSnap.exists()) {
            res.status(400).send("Username already used :'(");
        }
        else {
            res.status(200).send("Username available");
        }
    }
    catch (error) {
        res.status(500).send(error);
    }
}));
app.post("/create_user", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    yield (0, firestore_1.setDoc)((0, firestore_1.doc)(db, "user", username), {
        username: username,
        posts: []
    });
    res.status(200).send(":)");
}));
app.post("/add_post", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, question, answer } = req.body;
    const map = { question: answer };
    const docUpdate = (0, firestore_1.doc)(db, "user", username);
    yield (0, firestore_1.updateDoc)(docUpdate, {
        posts: (0, firestore_1.arrayUnion)(map)
    });
    res.status(200).send(":)");
}));
app.get("/all_posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseFloat(req.query.page);
    const username = req.headers.username;
    const docRef = (0, firestore_1.doc)(db, "user", username);
    const docSnap = yield (0, firestore_1.getDoc)(docRef);
    if (docSnap.exists()) {
        const data = docSnap.data();
        const posts = data.posts;
        const postSlice = posts.slice(arraySize * (page - 1), arraySize * page);
        res.status(200).send(postSlice);
    }
    else {
        console.log("Why no user");
        res.status(404).send("Username not found ");
    }
}));

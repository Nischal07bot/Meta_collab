import * as roomController from "../Controllers/roomController.js";
import {Router} from "express";
import {body} from "express-validator";
const router=Router();
router.post("/create",roomController.createRoom);
//router.get("/getrooms",roomController.getRooms);
router.post("/joinroom",roomController.joinRoom);
export default router; 
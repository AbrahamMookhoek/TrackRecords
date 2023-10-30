import express from 'express';
import router from './signup';
router = express.Router();

router.get("/", (req, res) => {
    res.send("WELCOME TO THE HOMEPAGE")
})

export default router
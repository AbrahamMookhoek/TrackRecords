const express = require('express')
const router = express.Router()

router.get("/", (req, res) => {
    print(res)

    res.send("HELLO")
})

module.exports = router
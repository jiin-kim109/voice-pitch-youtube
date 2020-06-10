const express = require('express');
const router = express.Router();

const youtubeStream = require('youtube-audio-stream');

router.get('/', (req, res)=> res.json({username:'bryans'}));

router.get('/youtube/:videoId', (req, res) => {
    try{
        youtubeStream(req.params.videoId).pipe(res);
    }
    catch (e) {
        res.status(500).send(e);
    }
});

module.exports = router;
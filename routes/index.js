const express = require('express');
const router = express.Router();
const indexService = require('../services/indexService');


router.get('/getGoogleResult', (req, res, next) => {
    console.log('reqbody ' + req.body);
    indexService.getGoogleResult(req.body, function (err, results) {
        console.log(err);
        if (err) {
            console.log(err);
            res.json({
                success: 0,
                error: err
            });
            return;
        }
        console.log(results);
        res.json(results)
    });
});

router.get('/index', (req, res, next) => {
    let query = req.query
    indexService.getImageList(query, function (err, results) {
        console.log(err);
        if (err) {
            console.log(err);
            res.json({
                success: 0,
                error: err
            });
            return;
        }
        // console.log(JSON.stringify(results));
        res.render('index', { data: JSON.stringify(results) })

    });
});


module.exports = router;

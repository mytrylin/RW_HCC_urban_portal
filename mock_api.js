var express = require('express');
var app = express();
var Feed = require('rss-to-json');

var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json({ type: 'application/json' })); // for parsing application/json

var request = require('request');



app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    // res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    // res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json");
    next();
});

// RSS
app.get('/RSS', function (req, res) {
    Feed.load('http://landuse.hccg.gov.tw/landinfo/hcurbanRSS/RSS.aspx', function (err, rss) {
        res.send({
            response: rss,
            err: err
        })
    });
});

// Login
app.post('/login', function (req, res) {
    request({
        uri: 'https://urbangis.hccg.gov.tw/HccgApi/api/Sso/Sso_VerifyUserAccount',
        form: req.body
    }, function (err, result) {
        res.send({
            response: result,
            err: err
        })
    });
});

// dashboard
/**
 * 社會經濟指標：各年度執照登記數量
 * https://urbangis.hccg.gov.tw/HccgApi/api/DashBoard/GetSocioeconomicBdLicYearCountList
 *
 * 社會經濟指標：產業發展指標
 * https://urbangis.hccg.gov.tw/HccgApi/api/DashBoard/GetSocioeconomicIndustrialDevelopmentCountList
 *
 * 案件申請指標：使用分區、圖資案件申請數
 * https://urbangis.hccg.gov.tw/HccgApi/api/DashBoard/GetApplicationCaseCountList
 *
 * 案件申請指標：各年度使用分區、圖資案件申請數
 * https://urbangis.hccg.gov.tw/HccgApi/api/DashBoard/GetApplicationCaseYearCountList
 *
 */
app.get('/DashBoard/:ta', function (req, res) {

    request({
        uri: 'https://urbangis.hccg.gov.tw/HccgApi/api/DashBoard/' + req.params.ta + "?Token=string",
        method: "post"
    }, function (err, result) {
        res.send({
            response: result.body,
            err: err
        })
    });
});

// GetSectList
// URLs:
// 0 is "/Landuse/Landuse_GetLanduseInfoByLandNo"
// 1 is "/LandLaw/LandLaw_GetLandLawInfoByLandNo"
// 2 is "/Values/GetSectList"
// 3 is "/Values/GetLandNoLen8FromSimple"
app.post('/search/:ta', function (req, res) {
    let api = [
        "https://urbangis.hccg.gov.tw/HccgApi/api/Landuse/GetLanduseInfoByLandNo",
        "https://urbangis.hccg.gov.tw/HccgApi/api/LandLaw/GetLandLawInfoByLandNo",
        "https://urbangis.hccg.gov.tw/HccgApi/api/Values/GetSectList",
        "https://urbangis.hccg.gov.tw/HccgApi/api/Values/GetLandNoLen8FromSimple"
    ]

    // console.log(req.body.landNo)
    let tempConfig = {}
    if (+req.params.ta === 3) {
        tempConfig.uri = api[req.params.ta] + "?landNo=" + req.body.landNo
        tempConfig.method = "get"

    } else {
        tempConfig.uri = api[req.params.ta]
        tempConfig.method = "post"
        tempConfig.form = req.body
    }

    // console.log(tempConfig.form)

    request(tempConfig, function (err, response, result) {
        res.send({
            response: result,
            err: err
        })
    });

});

app.listen(3000, () => {
    console.log("server is runing at 3000")
});
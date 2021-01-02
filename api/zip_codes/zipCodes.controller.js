const Constants = require('../../constants/constants');
const {getInfoByCap} = require("./zipCodes.service");
const {ZipCode} = require("../../model/ZipCode");

module.exports = {
    getInfoByCap : (req, res) => {
        const cap = req.params.cap;

        if(!cap || cap.includes("&") || cap.includes("|")){
            return res.status(Constants.HTTP_CODE_NOTFOUND).json({
                code: Constants.HTTP_CODE_NOTFOUND,
                message: Constants.HTTP_MESSAGE_NOTFOUND,
            });
        }

        getInfoByCap(cap, (err, results) => {

            if(err){
                return res.status(Constants.HTTP_CODE_INTERNAL_ERROR).json({
                    code: Constants.HTTP_CODE_INTERNAL_ERROR,
                    message: Constants.HTTP_MESSAGE_DATABASE_ERROR,
                });
            }

            const places = [];

            results.forEach(place => {
                const placeToSend = new ZipCode(place.Cap, place.City, place.Province);
                places.push(placeToSend);
            });

            return res.status(Constants.HTTP_CODE_OK).json({
                code: Constants.HTTP_CODE_OK,
                message: Constants.HTTP_MESSAGE_OK,
                result: places
            });
        })
    }
}
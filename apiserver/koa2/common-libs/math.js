/**
 * Created by jin on 8/18/17.
 */


exports.getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

exports.getRandomArbitrary = function (min, max) {
    return Math.random() * (max - min) + min
}




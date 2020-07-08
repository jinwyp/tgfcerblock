/**
 * Created by jinwyp on 4/19/17.
 */

const ipAddress = require('ipaddr.js');

function getIP (ip){

    let resultIP = {
        ipv4 : '',
        ipv6 : ''
    }

    if (ipAddress.isValid(ip)){

        if (ipAddress.IPv4.isValid(ip)) {

            // ipString is IPv4
            let currentIPv4 = ipAddress.IPv4.parse(ip);
            resultIP.ipv4 = ip;
            resultIP.ipv6 = currentIPv4.toIPv4MappedAddress();

        } else if (ipAddress.IPv6.isValid(ip)) {

            resultIP.ipv6 = ip;

            let currentIPv6 = ipAddress.IPv6.parse(ip);
            if (currentIPv6.isIPv4MappedAddress()) {

                // ip.toIPv4Address().toString() is IPv4
                resultIP.ipv4 = currentIPv6.toIPv4Address().toString();

            } else {
                // ipString is IPv6
            }
        } else {
            // ipString is invalid
            return false
        }

    }else{
        // ipString is invalid
        return false
    }


    return resultIP;

}


function getIPMiddleware(options) {

    return async function (ctx, next) {

        let currentIP = getIP(ctx.ip);

        if (currentIP){
            ctx.ipv4 = currentIP.ipv4;
            ctx.ipv6 = currentIP.ipv6;
        }

        return next();
    }
}



module.exports = getIPMiddleware;
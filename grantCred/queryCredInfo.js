'use strict'

module.exports.info = "querying accounts";

let bc, contx;
let credInfo_array;

module.exports.init = function(blockchain, context, args){
    const uploadCredInfo = require('./uploadCredInfo.js');
    bc = blockchain;
    contx = context;
    credInfo_array = uploadCredInfo.credInfo_array;
    return Promise.resolve();
}


module.exports.run = function(){
    const pre = credInfo_array[Math.floor(Math.random() * (credInfo_array.length))];
    if(bc.bcType === 'fabric'){
        let args = {
            chaincodeFunction : 'queryCredInfo',
            chaincodeArguments: [pre[0]]
        }
        return bc.bcObj.querySmartContract(contx, 'applyCred', 'v1', args, 10);
    }
}

module.exports.end = function(){
    return Promise.resolve();
}
'use strict'

module.exports.info = "querying accounts";

let bc, contx;
let applyInfo_array;

module.exports.init = function(blockchain, context, args){
    const uploadApplyInfo = require('./uploadApplyInfo.js');
    bc = blockchain;
    contx = context;
    applyInfo_array = uploadApplyInfo.applyInfo_array;
    return Promise.resolve();
}


module.exports.run = function(){
    const pre = applyInfo_array[Math.floor(Math.random() * (applyInfo_array.length))];
    if(bc.bcType === 'fabric'){
        let args = {
            chaincodeFunction : 'queryApplyInfo',
            chaincodeArguments: [pre[0]]
        }
        return bc.bcObj.querySmartContract(contx, 'applyCred', 'v1', args, 10);
    }
}

module.exports.end = function(){
    return Promise.resolve();
}
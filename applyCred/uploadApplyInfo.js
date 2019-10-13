'use strict'

module.exports.info = 'upload apply info'

let txnPerBatch;
let bc, contx;
let applyInfo_array = [];


module.exports.init = function(blockchain, context, args){
    if(!args.hasOwnProperty('txnPerBatch')){
        args.txnPerBatch = 1;
    }
    txnPerBatch = args.txnPerBatch;
    bc = blockchain;
    contx = context;
    return Promise.resolve();
};

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

let difChar = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

function generateString(){
    return randomString(32, difChar)
}


function generateApplyInfo(){
    var applyInfo = [
        generateString(),
        generateString(),
		generateString(),
		generateString(),
		generateString()
		
    ]
    return applyInfo
}

function generateWorkload(){
    let workload = [];
    for(var i = 0; i < txnPerBatch; i++){
        let applyInfo = generateApplyInfo();
        applyInfo_array.push(applyInfo)

        if(bc.bcType == 'fabric'){
            workload.push({
                chaincodeFunction:"uploadApplyInfo",
                chaincodeArguments: applyInfo
            });
        }
    }
    return workload
}

module.exports.run = function(){
    let args = generateWorkload();
    return bc.invokeSmartContract(contx, "applyCred", "v1", args, 5000);
}

module.exports.end = function(){
    return Promise.resolve();
}

module.exports.applyInfo_array = applyInfo_array;
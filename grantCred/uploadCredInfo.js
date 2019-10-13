'use strict'

module.exports.info = 'upload cred info'

let txnPerBatch;
let bc, contx;
let credInfo_array = [];


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


function generateCredInfo(){
    var credInfo = [
        generateString(),
        generateString()       
    ]
    return credInfo
}

function generateWorkload(){
    let workload = [];
    for(var i = 0; i < txnPerBatch; i++){
        let credInfo = generateCredInfo();
        credInfo_array.push(credInfo)

        if(bc.bcType == 'fabric'){
            workload.push({
                chaincodeFunction:"uploadCredInfo",
                chaincodeArguments: credInfo
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

module.exports.credInfo_array = credInfo_array;
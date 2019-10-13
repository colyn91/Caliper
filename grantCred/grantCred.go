package main

import (
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

type smartcontract struct {
}

type applyInfo struct {
	commitValue          string `json:"commitValue"`
	attrSets             string `json:"attrSets"`	
}

type Event struct {
	Txid string `json:"Txid"`
	Hash string `json:"Hash"`
}

func (s *smartcontract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

func (s *smartcontract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "uploadCredInfo" {
		return s.uploadCredInfo(APIstub, args)
	} else if function == "queryCredInfo" {
		return s.queryCredInfo(APIstub, args)
	} 
	return shim.Success([]byte("Invoke success"))
}

func (s *smartcontract) uploadCredInfo(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2, get " + string(len(args)))
	}
	var newRow = applyInfo{commitValue: args[0], attrSets: args[1]}
	//var newRow = applyInfo{commitValue:"1", attrSets:"asdf"}
	requestAsBytes, _ := json.Marshal(newRow)
	APIstub.PutState(args[0], requestAsBytes)

	var event = Event{Txid: APIstub.GetTxID(), Hash: args[0]}
	eventAsBytes, _ := json.Marshal(event)
	APIstub.SetEvent("upload success", eventAsBytes)

	return shim.Success([]byte("upload success"))
}

func (s *smartcontract) queryCredInfo(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1, get " + string(len(args)))
	}
	infoAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(infoAsBytes)
}


func main() {

	// Create a new Smart Contract
	err := shim.Start(new(smartcontract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}

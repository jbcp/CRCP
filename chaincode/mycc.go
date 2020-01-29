/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/*
 * The sample smart contract for documentation topic:
 * Writing Your First Blockchain Application
 */

package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

var logger = shim.NewLogger("fabric-boilerplate")

// Define the Smart Contract structure
type SmartContract struct {
}

// Define the Consent structure, with 4 properties.  Structure tags are used by encoding/json library
type Consent struct {
	Site       string `json:"site"`
	Study      string `json:"study"`
	ConsentVer string `json:"consent_ver"`
	Contents   string `json:"contents"`
}

// Define the Subject structure
type Subject struct {
	Name  string `json:"subject"`
	Site  string `json:"site"`
	Study string `json:"study"`

	ConsentVer string `json:"consent_ver"`
	DosageDT   string `json:"dosage_dt"`

	SubjectSign    string `json:"subject_sign"`
	Investigator   string `json:"investigator"`
	IvSignDT       string `json:"iv_sign_dt"`
	Classification string `json:"classification"`
}

/*
 * The Init method is called when the Smart Contract "fabSubject" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabSubject"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "querySubject" {
		return s.querySubject(APIstub, args)
	} else if function == "queryConsent" {
		return s.queryConsent(APIstub, args)
	} else if function == "doseSubject" {
		return s.doseSubject(APIstub, args)
	} else if function == "agreeConsent" {
		return s.agreeConsent(APIstub, args)
	} else if function == "withdrawConsent" {
		return s.withdrawConsent(APIstub, args)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	} else if function == "createSubject" {
		return s.createSubject(APIstub, args)
	} else if function == "createConsent" {
		return s.createConsent(APIstub, args)
	} else if function == "queryAllSubjects" {
		return s.queryAllSubjects(APIstub)
	} else if function == "changeSubject" {
		return s.changeSubject(APIstub, args)
	} else if function == "queryAllSubjectsWithPagination" {
		return s.queryAllSubjectsWithPagination(APIstub, args)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) querySubject(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// if len(args) != 1 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 1")
	// }
	fmt.Println("Added+++++++++++++++++++++++++++++++++++++", args[0])
	logger.Infof("Added+++++++++++++++++++++++++++++++++++++", args[0])
	subjectAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(subjectAsBytes)
}
func (s *SmartContract) queryConsent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// if len(args) != 1 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 1")
	// }
	logger.Infof("Added+++++++++++++++++++++++++++++++++++++", args[0])
	consentAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(consentAsBytes)
}
func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	subjects := []Subject{
		Subject{Name: "김명화", Site: "site1", Study: "Jpx3415-0010-t", ConsentVer: "2.1", DosageDT: "", SubjectSign: "201001311100", Investigator: "김민걸", IvSignDT: "201001311107", Classification: "동의"},
		Subject{Name: "김명화", Site: "site1", Study: "Jpx3415-0010-t", ConsentVer: "2.1", DosageDT: "201002011512", SubjectSign: "201002011513", Investigator: "김민걸", IvSignDT: "201002011513", Classification: "투약"},
		Subject{Name: "박치복", Site: "site2", Study: "S001-tesert", ConsentVer: "1.1", DosageDT: "", SubjectSign: "201003050900", Investigator: "이승환", IvSignDT: "201003050905", Classification: "동의"},
	}
	i := 0
	for i < len(subjects) {
		fmt.Println("i is ", i)
		subjectAsBytes, _ := json.Marshal(subjects[i])
		APIstub.PutState("Subject"+strconv.Itoa(i), subjectAsBytes)
		fmt.Println("Added", subjects[i])
		i = i + 1
	}

	consents := []Consent{
		Consent{Site: "site1", Study: "Jpx3415-0010-t", ConsentVer: "2.1", Contents: "alskdjfoiquwelirj"},
		Consent{Site: "site2", Study: "S001-tesert", ConsentVer: "1.1", Contents: "qsdfwetssdf1543543"},
	}
	i = 0

	for i < len(consents) {
		fmt.Println("i is ", i)
		consentAsBytes, _ := json.Marshal(consents[i])
		APIstub.PutState("Consent"+strconv.Itoa(i), consentAsBytes)
		fmt.Println("Added", consents[i])
		i = i + 1
	}
	return shim.Success(nil)
}

func (s *SmartContract) createSubject(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	logger.Infof("+++++++++++++++++++++++++++++++++++++", args[0])

	// if len(args) != 2 || len(args) != 10 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 2 or 10")
	// }

	val, err := APIstub.GetState(args[0])
	if err != nil {
		fmt.Printf("[ERROR] cannot get state, because of %s\n", err)
		return shim.Error(fmt.Sprintf("%s", err))
	}

	if val != nil {
		errMsg := fmt.Sprintf("[ERROR] Subject already exists, cannot create two accounts with same ID <%d>", args[0])
		fmt.Println(errMsg)
		return shim.Error(errMsg)
	}

	fmt.Println("createSubject---len(args)", len(args))
	fmt.Println(" args[0]: ", args[0])
	if len(args) == 2 {
		var subject = Subject{Name: args[1], Site: "", Study: "", ConsentVer: "", DosageDT: "", SubjectSign: "", Investigator: "", IvSignDT: "", Classification: ""}
		subjectAsBytes, _ := json.Marshal(subject)
		APIstub.PutState(args[0], subjectAsBytes)
		fmt.Println("Added", subject)
	} else if len(args) == 10 {
		var subject = Subject{Name: args[1], Site: args[2], Study: args[3], ConsentVer: args[4], DosageDT: args[5], SubjectSign: args[6], Investigator: args[7], IvSignDT: args[8], Classification: args[9]}
		subjectAsBytes, _ := json.Marshal(subject)
		APIstub.PutState(args[0], subjectAsBytes)
		fmt.Println("Added", subject)
	} else {
		logger.Infof("error number of arguments should be 2 or 10.   it is ", len(args))
		return shim.Error("Incorrect number of arguments. Expecting 2 or 10")
	}

	return shim.Success(nil)
}
func (s *SmartContract) createConsent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// if len(args) != 5 {
	//  	return shim.Error("Incorrect number of arguments. Expecting 5")
	// }
	logger.Infof("+++++++++++++++++++++++++++++++++++++", args[0])
	logger.Infof("len(args)=", len(args))

	val, err := APIstub.GetState(args[0])
	if err != nil {
		fmt.Printf("[ERROR] cannot get state, because of %s\n", err)
		return shim.Error(fmt.Sprintf("%s", err))
	}

	if val != nil {
		errMsg := fmt.Sprintf("[ERROR] Consent already exists, Use update with same ID <%d>", args[0])
		fmt.Println(errMsg)
		return shim.Error(errMsg)
	}

	var consent = Consent{Site: args[1], Study: args[2], ConsentVer: args[3], Contents: args[4]}

	consentAsBytes, _ := json.Marshal(consent)
	APIstub.PutState(args[0], consentAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) queryAllSubjects(APIstub shim.ChaincodeStubInterface) sc.Response {

	//fmt.Println("Added+++++++++++++++++++++++++++++++++++++")
	startKey := "Subject0"
	endKey := "Subject999"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllSubjects:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}
func (s *SmartContract) agreeConsent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// if len(args) != 2 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 2")
	// }
	fmt.Println("agreeConsent-------key= " + args[0])

	subjectAsBytes, err := APIstub.GetState(args[0])
	if err != nil {
		// }
		fmt.Println("no data with this key:" + args[0])
		return shim.Error(err.Error())
	}
	if subjectAsBytes == nil {
		// }
		fmt.Println("no data with this key:" + args[0])
		return shim.Error(err.Error())
	}

	subject := Subject{}
	var lenstr = strconv.Itoa(len(args))
	if len(args) == 8 {
		fmt.Println("---8-------" + lenstr)
	} else if len(args) == 9 {
		fmt.Println("---9-------" + lenstr)
	} else {
		fmt.Println("-??" + lenstr)
	}
	json.Unmarshal(subjectAsBytes, &subject)
	subject.Site = args[1]
	subject.Study = args[2]
	subject.ConsentVer = args[3]
	subject.SubjectSign = args[4]
	subject.Investigator = args[5]
	subject.IvSignDT = args[6]
	subject.Classification = args[7]
	subjectAsBytes, _ = json.Marshal(subject)
	APIstub.PutState(args[0], subjectAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) withdrawConsent(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var lenstr = strconv.Itoa(len(args))
	if len(args) != 6 {
		logger.Infof("[withdrawConsent]Incorrect number of arguments. Expecting 6 but ", lenstr)
		return shim.Error("Incorrect number of arguments. Expecting 6")
	}
	logger.Infof("withdrawConsent key=", args[0])
	logger.Infof("len(args)=", len(args))

	subjectAsBytes, err := APIstub.GetState(args[0])
	if err != nil {
		// }
		fmt.Println("no data with this key:" + args[0])
		return shim.Error(err.Error())
	}
	if subjectAsBytes == nil {
		// }
		fmt.Println("no data with this key:" + args[0])
		return shim.Error(err.Error())
	}
	subject := Subject{}

	json.Unmarshal(subjectAsBytes, &subject)
	subject.Site = args[1]
	subject.Study = args[2]
	subject.ConsentVer = args[3]
	subject.SubjectSign = args[4]

	subject.Classification = args[5]
	subjectAsBytes, _ = json.Marshal(subject)

	APIstub.PutState(args[0], subjectAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) doseSubject(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// if len(args) != 2 {
	// 	return shim.Error("Incorrect number of arguments. Expecting 2")
	// }
	logger.Infof("[doseSubject] key=", args[0])
	subjectAsBytes, err := APIstub.GetState(args[0])

	if err != nil {
		// }
		fmt.Println("no data with this key:" + args[0])
		return shim.Error(err.Error())
	}
	if subjectAsBytes == nil {
		// }
		fmt.Println("no data with this key:" + args[0])
		return shim.Error(err.Error())
	}
	subject := Subject{}
	json.Unmarshal(subjectAsBytes, &subject)
	subject.Site = args[1]
	subject.Study = args[2]
	subject.DosageDT = args[3]
	subject.SubjectSign = args[4]
	subject.Investigator = args[5]
	subject.IvSignDT = args[6]
	subject.Classification = args[7]
	subjectAsBytes, _ = json.Marshal(subject)
	APIstub.PutState(args[0], subjectAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) changeSubject(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	// for  test

	subjectAsBytes, _ := APIstub.GetState(args[0])
	subject := Subject{}

	json.Unmarshal(subjectAsBytes, &subject)
	subject.Site = args[1]
	subject.Study = args[2]
	subject.ConsentVer = args[3]
	subject.DosageDT = args[4]
	subject.SubjectSign = args[5]
	subject.Investigator = args[6]
	subject.IvSignDT = args[7]
	subject.Classification = args[8]
	subjectAsBytes, _ = json.Marshal(subject)

	subjectAsBytes, _ = json.Marshal(subject)
	APIstub.PutState(args[0], subjectAsBytes)

	return shim.Success(nil)
}
func (s *SmartContract) queryAllSubjectsWithPagination(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	if len(args) < 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2")
	}
	startKey := "Subject0"
	endKey := "Subject999"

	pageSize, err := strconv.ParseInt(args[0], 10, 32)
	if err != nil {
		return shim.Error(err.Error())
	}
	bookmark := args[1]

	resultsIterator, _, err := APIstub.GetStateByRangeWithPagination(startKey, endKey, int32(pageSize), bookmark)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAllSubjects:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}

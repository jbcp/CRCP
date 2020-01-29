/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
// Setting for Hyperledger Fabric
const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');
const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');

var userName = "";
app.post('/api/login', async function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        try {
                const ssn = req.body.ssn;
                userName = 'uuid' + ssn;
                console.log(" userName:" + userName);
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), '/uuid/wallet');
                const wallet = new FileSystemWallet(walletPath);

                console.log(` Wallet path: ${walletPath}`);

                const userExists = await wallet.exists(userName);
                if (!userExists) {
                        console.log('An identity for the user does not  exists in the wallet');
                        res.status(200).json({ response: { result: 'no' } });
                        return;
                }

                res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.status(200).json({ response: { result: 'ok' } });
        } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`);
                res.status(500).json({ error: error });
                process.exit(1);
        }
        // res.redirect('/api/consent');
});

app.post('/api/consent', async function (req, res) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");

        try {
                const ssn = req.body.ssn;
           
                var subjectName='uuid'+req.body.ssn;     
                var userName = subjectName; 
               // var userName = 'uuid86502';     
                
                console.log(" userName:" + userName);
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), '/uuid/wallet');
                const wallet = new FileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);
                // Check to see if we've already enrolled the user.               
                const consentId = req.body.consent;
                const ivId = req.body.iv;
                // const userExists = await wallet.exists(userName);

                // current timestamp in milliseconds
                let ts = Date.now();
                let date_ob = new Date(ts);
                let date = date_ob.getDate();
                let month = date_ob.getMonth() + 1;
                let year = date_ob.getFullYear();
                // prints date & time in YYYY-MM-DD format
                console.log(year + "-" + month + "-" + date);
                var subjects_sign_dt= year + "-" + month + "-" + date;
                console.log(`Wallet path: ${walletPath}`);
                if (userName == "") {
                        console.log('An identity for the user' + userName + ' is not vallid');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, { wallet, identity: userName, discovery: { enabled: true, asLocalhost: true } });
                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');
                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Submit the specified transaction.
                // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
               await contract.submitTransaction('createSubject', subjectName, "", "전북대", req.body.consent, "","", subjects_sign_dt, req.body.iv,"", "동의");
               // await contract.submitTransaction('createSubject',subjectName, userName);
                console.log('Transaction has been submitted');

                //await contract.submitTransaction('agreeConsent', req.params.subject_index, req.body.site, req.body.study, req.body.consent_ver, req.body.subject_sign, req.body.investigator, req.body.iv_sign_dt, req.body.classification);
             //   var subject = Subject{Name: args[1], Site: args[2], Study: args[3], ConsentVer: args[4], DosageDT: args[5], SubjectSign: args[6], Investigator: args[7], IvSignDT: args[8], Classification: args[9]}

               // res.send('Transaction has been submitted');
                res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "X-Requested-With");
                res.status(200).json({ response: { result: 'ok' } });
                // Disconnect from the gateway.
                await gateway.disconnect();
        } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                process.exit(1);
        }
});

app.get('/api/queryallsubjects', async function (req, res) {


        try {


                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = new FileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);
                // Check to see if we've already enrolled the user.
                const userExists = await wallet.exists('user1');
                if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');
                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Evaluate the specified transaction.
                // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
                // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
                const result = await contract.evaluateTransaction('queryAllSubjects');
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                res.status(200).json({ response: JSON.parse(result.toString()) });
        } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`);
                res.status(500).json({ error: error });
                process.exit(1);
        }
});


// app.get('/api/querysubject/:subject_index', async function (req, res) {
//         try {
//                 // Create a new file system based wallet for managing identities.
//                 const walletPath = path.join(process.cwd(), 'wallet');
//                 const wallet = new FileSystemWallet(walletPath);
//                 console.log(`Wallet path: ${walletPath}`);
//                 // Check to see if we've already enrolled the user.
//                 const userExists = await wallet.exists('user1');
//                 if (!userExists) {
//                         console.log('An identity for the user "user1" does not exist in the wallet');
//                         console.log('Run the registerUser.js application before retrying');
//                         return;
//                 }
//                 // Create a new gateway for connecting to our peer node.
//                 const gateway = new Gateway();
//                 await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
//                 // Get the network (channel) our contract is deployed to.
//                 const network = await gateway.getNetwork('mychannel');
//                 // Get the contract from the network.
//                 const contract = network.getContract('fabcar');
//                 // Evaluate the specified transaction.
//                 // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
//                 // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
//                 const result = await contract.evaluateTransaction('querySubject', req.params.subject_index);
//                 console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
//                 res.status(200).json({ response: JSON.parse(result.toString()) });
//         } catch (error) {
//                 console.error(`Failed to evaluate transaction: ${error}`);
//                 res.status(500).json({ error: error });
//                 process.exit(1);
//         }
// });


app.post('/api/createsubject/', async function (req, res) {
        try {
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = new FileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);
                // Check to see if we've already enrolled the user.               

                const userExists = await wallet.exists('user1');
                if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');
                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Submit the specified transaction.
                // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                await contract.submitTransaction('createSubject', req.body.subjectid, req.body.subject);
                console.log('Transaction has been submitted');
                res.send('Transaction has been submitted');
                // Disconnect from the gateway.
                await gateway.disconnect();
        } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                process.exit(1);
        }
});



app.put('/api/agreeconsent/:subject_index', async function (req, res) {
        try {
                console.log("---------------------------------------------");
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = new FileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);

                console.log(`---req.body.study: ` + req.body.study);
                console.log(`---req.body.site: ` + req.body.site);

                // Check to see if we've already enrolled the user.
                const userExists = await wallet.exists('user1');
                if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');
                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Submit the specified transaction.
                // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                await contract.submitTransaction('agreeConsent', req.params.subject_index, req.body.site, req.body.study, req.body.consent_ver, req.body.subject_sign, req.body.investigator, req.body.iv_sign_dt, req.body.classification);
                console.log('Transaction has been submitted');
                res.send('Transaction has been submitted');
                // Disconnect from the gateway.
                await gateway.disconnect();
        } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`);

                process.exit(1);
        }
});
app.put('/api/withdrawconsent/:subject_index', async function (req, res) {
        try {
                console.log("----------------동의철회-----------------------------");
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = new FileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);


                // Check to see if we've already enrolled the user.
                const userExists = await wallet.exists('user1');
                if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');
                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Submit the specified transaction.
                // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                await contract.submitTransaction('withdrawConsent', req.params.subject_index, req.body.site, req.body.study, req.body.consent_ver, req.body.subject_sign, req.body.classification);
                console.log('Transaction has been submitted');
                res.send('Transaction has been submitted');
                // Disconnect from the gateway.
                await gateway.disconnect();
        } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`);

                process.exit(1);
        }
});

app.get('/api/queryconsent/:consent_index', async function (req, res) {
        try {
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = new FileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);
                // Check to see if we've already enrolled the user.
                const userExists = await wallet.exists('user1');
                if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');
                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Evaluate the specified transaction.
                // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
                // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
                const result = await contract.evaluateTransaction('queryConsent', req.params.consent_index);
                console.log(`Transaction has been evaluated, result is: ${result.toString()}`);
                res.status(200).json({ response: JSON.parse(result.toString()) });
        } catch (error) {
                console.error(`Failed to evaluate transaction: ${error}`);
                res.status(500).json({ error: error });
                process.exit(1);
        }
});
app.post('/api/createconsent/', async function (req, res) {
        try {
                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = new FileSystemWallet(walletPath);
                console.log(`Wallet path: ${walletPath}`);
                // Check to see if we've already enrolled the user.               

                const userExists = await wallet.exists('user1');
                if (!userExists) {
                        console.log('An identity for the user "user1" does not exist in the wallet');
                        console.log('Run the registerUser.js application before retrying');
                        return;
                }
                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });
                // Get the network (channel) our contract is deployed to.
                const network = await gateway.getNetwork('mychannel');
                // Get the contract from the network.
                const contract = network.getContract('fabcar');
                // Submit the specified transaction.
                // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
                // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
                await contract.submitTransaction('createConsent', req.body.consentid, req.body.site, req.body.study, req.body.consent_ver, req.body.contents);
                console.log('Transaction has been submitted');
                res.send('Transaction has been submitted');
                // Disconnect from the gateway.
                await gateway.disconnect();
        } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                process.exit(1);
        }
});
app.listen(8080);

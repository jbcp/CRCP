/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json());
// Setting for Hyperledger Fabric

const path = require('path');
//const bcrypt = require(bcrypt - nodejs);
const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');
const { FileSystemWallet, Gateway, X509WalletMixin } = require('fabric-network');



// app.get('/enrollmentAdmin', async function (req, res) {

// });

app.post('/registMember', async function (req, res) {
        res.header("Access-Control-Allow-Origin", "*"); 
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        try {
                const name = req.body.name;
                const siteId = req.body.site;
                const ssn = req.body.ssn;
                const userName = 'uuid'+ssn;
                //  const userName = bcrypt.hashSync(name + ssn);//'User1@org1.example.com';
                console.log(name + " "+siteId+" " + userName + "->" + userName);

                // Create a new file system based wallet for managing identities.
                const walletPath = path.join(process.cwd(), 'wallet');
                const wallet = new FileSystemWallet(walletPath);
                console.log(` Wallet path: ${walletPath}`);
                
                const userExists = await wallet.exists(userName);
                if (userExists) {
                    console.log('An identity for the user "user2" already exists in the wallet');
                    return;
                }
                
                // Check to see if we've already enrolled the admin user.



                const adminExists = await wallet.exists('admin');
                if (!adminExists) {
                        console.log('An identity for the admin user "admin" does not exist in the wallet');
                        console.log('Run the enrollAdmin.js application before retrying');
                        return;
                }


                // Create a new gateway for connecting to our peer node.
                const gateway = new Gateway();
                await gateway.connect(ccpPath, { wallet, identity: 'admin', discovery: { enabled: true, asLocalhost: true } });


                //await gateway.connect(connectionProfile, connectionOptions);
                // Get the CA client object from the gateway for interacting with the CA.
                const ca = gateway.getClient().getCertificateAuthority();
                const adminIdentity = gateway.getCurrentIdentity();
                // Register the user, enroll the user, and import the new identity into the wallet.
                const secret = await ca.register({ affiliation: 'org1.department1', enrollmentID: userName, role: 'client' }, adminIdentity);
                const enrollment = await ca.enroll({ enrollmentID: userName, enrollmentSecret: secret });
                const userIdentity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
                await wallet.import(userName, userIdentity);
                console.log('Successfully registered and enrolled admin user' + userName);
                // const result = userIdentity.privateKey;
                console.log(`Transaction has been evaluated, result is:`);
                
                // var result =userIdentity.privateKey;
                // var result1 =userIdentity.certificate ;
                // result1 ={"pri": userIdentity.privateKey, "pub": userIdentity.certificate };
                // console.log("--------------------------------");
                // console.log(userIdentity);
                // console.log("--------------------------------");
                //console.log(wallet);



               // res.header("Access-Control-Allow-Origin", "*"); res.header("Access-Control-Allow-Headers", "X-Requested-With");
                //res.status(200).json({ response:{name:name, ssn:ssn, site:siteId, privateKey:userIdentity.privateKey, ecert: userIdentity.certificate}});
        } catch (error) {
                console.error(`Failed to submit transaction: ${error}`);
                process.exit(1);
        }
});


app.listen(8080);

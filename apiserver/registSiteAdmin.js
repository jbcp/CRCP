/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
var express = require('express');
var bodyParser = require('body-parser')
var app = express();
app.use(bodyParser.json());

const FabricCAServices = require('fabric-ca-client');
const { FileSystemWallet, X509WalletMixin } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(__dirname,  'connection-org1.json');
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

app.post('/api/regist_site_admin', async function (req, res) {

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    try {
        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
        const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        await wallet.import('admin', identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet');

        console.log('Successfully enrolled admin user  admin  and imported it into the wallet');
        res.status(200).json({ response: adminWallet });

    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error}`);
        process.exit(1);
    }
});
app.listen(8080);


  //   const name = req.body.name;
           // const siteId = req.body.site;
       //const userId=req.body.admin;
       // const admin_id = req.body.admin;
        //const site_id = req.body.site;
       // if(site_id) site_id='site1';
       // const userName = 'admin_'+site_id+'_'+ssn;
    //    // const adminPW = req.body.pass;
    //    console.log('userName : '+userId + '\n passwd'+adminPW);

    //    // // Create a new CA client for interacting with the CA.
    //    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    //    const caTLSCACerts = caInfo.tlsCACerts.pem;
    //    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

    //    // Create a new file system based wallet for managing identities.
    //    const walletPath = path.join(process.cwd(), '/pw/wallet');
    //    const wallet = new FileSystemWallet(walletPath);
    //    console.log(`Wallet path: ${walletPath}`);

    //    // Check to see if we've already enrolled the admin user. 
    //    const adminExists = await wallet.exists(userId);
    //    if (!adminExists) {
    //        console.log('An identity for the admin user ' + userId+ 'NOT exists in the wallet');
    //        return;
    //    }
    //    else console.log('An identity for the admin user ' + userId+ ' is exists in the wallet');
    //    const adminWallet= wallet.export(userId);
    //    const adminWallet= wallet.export(userName);
    //    // console.log(adminWallet);
    //    // console.log("adminWallet::  ");
    //    // console.log(adminWallet.private);
    //    // // Enroll the admin user, and import the new identity into the wallet.
    //    const enrollment = await ca.enroll({ enrollmentID: userName, enrollmentSecret: userPW });
    //    const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
    //    await wallet.import('admin', identity);

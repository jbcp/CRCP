# CRCP
Clinical Research Chain Platform

## 요약
+ 임상시험 동의서 일부의 내용을 블록체인에 저장하고 공유
+ IBM HyperLedger Fabric 블록체인 네트워크 정보를 읽고 쓰기위한 체인코드 프로그램과 그 체인코드와 연계한 서버 웹 프로그램으로 구성
+ 보건복지부 "블록체인 기반 차세대 임상시험 플랫폼 구축" 과제 1차년도 결과

## 주요기능
+ 블록체인 네트워크 사용자 등록 권한 요청
+ 자원자 등록
+ 웹서버 API

## Prerequisites
+ Hyperledger Fabric 1.4.x Example  - [link](https://hyperledger-fabric.readthedocs.io/en/release-1.4/prereqs.html)
+ nodejs 8.0, npm
+ docker 1.14.0
+ docker-compose 1.25.0
+ go 1.12.x
+ git
+ Python 2.7

## Installation
1. install Hyperledger Fabric 1.4 Example
```
curl -sSL http://bit.ly/2ysbOFE | bash -s
```
2. go to ./fabric/fabric-samples/fabcar/
3. move apiserver folder to ~/fabric/fabric-samples/fabcar/.
4. move chaincode/mycc.go to ~/fabric/fabric-samples/chaincode/. 
   - if there is other files, remove them.
5. run fabcar example and apiserver
```
./startFabric.sh
cd ~/fabric/fabric-samples/fabcar/apiserver
rm -rf wallet
node enrollAdmin.js
node registerUser.js 
```
6. go to IP:8080 on web browser

## Contact to developer(s)
+ [SANGUN JEONG](https://github.com/swjeong0502) - swjeong@jbcp.kr
+ [JIHYOUNG LEE](https://github.com/jhlee2376) - jhlee@jbcp.kr


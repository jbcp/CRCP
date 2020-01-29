# CRCP
Clinical Research Chain Platform

## 요약
+ 보건복지부 "블록체인 기반 차세대 임상시험 플랫폼 구축" 과제 1차

## Prerequisites
+ Hyperledger 1.4 Example
+ nodejs 8.0
+ docker, docker-compose

## Installation
+ ./bootstrap/config/db.properties 를 작성한다.
```
ID = [rds id]
PASSWD = [rds password]
rdsIP = [localhost / rds ip]
dbPort = [port]

```
+ go to ./bootstrap
```
npm install
cd ../src/
```
+ run java with libraries
```
sudo javac -cp ../library/*:. ./*.java
sudo java -cp ../library/*:. AnalysisCT
```

+ after ending previous processing, go to ./bootstrap folder 
+ run express server
```
node server.js 
```

## Pics
![Clinicaltrial.kr](/ct1.png)

## Contact to developer(s)
+ [SANGUN JEONG](https://github.com/swjeong0502) - swjeong@jbcp.kr
+ [JIHYOUNG LEE](https://github.com/jhlee2376) - jhlee@jbcp.kr


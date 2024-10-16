## Installation and run 
 - step 1 make sure that your computer has redis
 - step 2 npm install
 - step 3 npm run dev
 - step 4

## Create token
- OPEN POSTMAN and create data use api 
  ```http://localhost:6268/api/register-information-1nce (method POST)
  {
    "username": "username",
    "password": "password"
  }```
- username and password is 1nce provider

## rate limit api 
 - https://help.1nce.com/dev-hub/reference/api-rate-limits

## token use web time max 30d

## job get sim new save data server 
 - 5p/get 1 lan
 - when sim create save database will default quota in table 


## job check add volumn every sim when setting sim have quota sim (setting) < quota sim get ve
 - 1p/get 1 lan


## api register information 1nce (method POST)
 - http://localhost:6268/api/register-information-1nce
  {
    "username": "username",
    "password": "password"
  }
  - username và password is 1nce  provider

## model have  collection USER and SIM
 - collection USER (username , password , user_infor_base64 , token_nce)
   -- username , password is 1nce provider
   -- user_infor_base64 is base64(username:password) use get token_nce
   -- token_nce use action api 1nce
 - collection SIM (iccid , bank  , quota)
   -- iccid is dentification sim
   -- bank is bank add money (buy data sim)
   -- quota is volumn setup when have datasim < quota will buy data

## data fetch response api get informations sims 
 https://help.1nce.com/dev-hub/reference/getsimsusingget
 
 


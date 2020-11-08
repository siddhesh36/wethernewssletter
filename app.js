// jshint esversion:6

const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.get("/failure",function(req,res){
    res.redirect(__dirname + "/signup.html");
});

app.post("/",function(req,res){
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us2.api.mailchimp.com/3.0/lists/b178797031";

    const options = {
        method : "POST",
        auth: "simba01010:cb19ba92f471f746a431612dd2d264ea-us2",
    };

    const reqeust = https.request(url, options, function(response){
        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        } else {
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
    });

    reqeust.write(jsonData);
    reqeust.end();
});

app.listen(process.env.PORT || 3000, function(){
    console.log("server is running at port");
});

//API key
//cb19ba92f471f746a431612dd2d264ea-us2
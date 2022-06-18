const nodemailer = require("nodemailer");
const ejs=require('ejs');
const path=require('path');
let transporter = nodemailer.createTransport({
    service:'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS
    },
});

let renderTemplate=(data,relativePath)=>{
    let mailhtml;
    ejs.renderFile(
        path.join(__dirname,'../views/mailers',relativePath),
        data,
        function(err,template){
            if(err){
                console.log('error in rendering template',err);
                return;
            }
            mailhtml=template;
        }
    )
    return mailhtml;
}
module.exports={
    transporter:transporter,
    renderTemplate:renderTemplate
}
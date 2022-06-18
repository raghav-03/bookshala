const nodeMailer = require('../config/nodemailer');
exports.request = (user) => {
    console.log('Inside Request mailer', user);
    // console.log(user.name)
    let htmlstring=nodeMailer.renderTemplate({user:user},'/request-mailer/request.ejs');
    nodeMailer.transporter.sendMail({
       from: 'agarwalraghav892@gmail.com',
       to: user.email,
       subject: "Request For Book",
       html: htmlstring 
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent', info);
        return;
    });
}
exports.requestsender = (user) => {
    console.log('Inside Request mailer', user);
    // console.log(user.name)
    let htmlstring=nodeMailer.renderTemplate({user:user},'/request-mailer/requestsender.ejs');
    nodeMailer.transporter.sendMail({
       from: 'agarwalraghav892@gmail.com',
       to: user.email,
       subject: "Request For Book",
       html: htmlstring 
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent', info);
        return;
    });
}
exports.otp = (user) => {
    console.log('Inside Otp mailer', user);
    // console.log(user.name)
    let htmlstring=nodeMailer.renderTemplate({user:user},'/request-mailer/otpsender.ejs');
    nodeMailer.transporter.sendMail({
       from: 'agarwalraghav892@gmail.com',
       to: user.email,
       subject: "Otp for Verification!",
       html: htmlstring 
    }, (err, info) => {
        if (err){
            console.log('Error in sending mail', err);
            return;
        }
        console.log('Message sent', info);
        return;
    });
}
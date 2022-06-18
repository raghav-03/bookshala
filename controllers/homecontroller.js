const db = require('../config/mongoose');
const User=require('../models/user');
const Sell=require('../models/sell');
const Otp=require('../models/otp');
const Notes=require('../models/notes');
const nodemailer=require('../mailers/request');
const { compile } = require('ejs');
module.exports.home=function(req,res){
    res.render('home',{
        title: "Bookshala"
    });
    return;
}
module.exports.notes=function(req,res){
    Notes.find({},function(err,list){
        if(err){
            console.log('Error in fetching list');
            return;
        }
        res.render('notes',{
            title: "Bookshala",
            notes_list:list
        });
        return;
    });
}
module.exports.home1=function(req,res){
    if(req.user.admin=='No'){  
        return res.redirect('back');
    }
    Sell.find({},function(err,list){
        if(err){
            console.log('Error in fetching list');
            return;
        }
        res.render('admin',{
            title: "Bookshala",
            book_list:list
        });
        return;
    });
}
module.exports.sellbook=function(req,res){
    res.render('sellbook',{
        title: "Bookshala"
    });
    return;
}
module.exports.buybook=function(req,res){
    Sell.find({},function(err,list){
        if(err){
            console.log('Error in fetching list');
            return;
        }
        res.render('buybook',{
            title: "Bookshala",
            book_list:list
        });
        return;
    });
}
module.exports.pickupdone=function(req,res){
    let id = req.body.task;
    //check weather their is any task or not
    if(id==undefined){
        req.flash('error',' Please Select any checkbox to Mark the Status');
        console.log('Please Select any checkbox to Mark the Status');
        return res.redirect('back');
    }
    Sell.findById(id,function(err,Task){
        if(err){
            console.log('Error in Marking the Pickup Done');
            return res.redirect('back');
        }
        if(Task){
            Task.pickup="no";
            Task.save();
            return res.redirect('back');
        }
    });
    
}
module.exports.purchased=function(req,res){
    let id = req.body.task;
    //check weather their is any task or not
    if(id==undefined){
        req.flash('error',' Please Select any checkbox to Buy a Book ')
        console.log('Please Select any checkbox to Buy a Book');
        return res.redirect('back');
    }
    Sell.findById(id,function(err,Task){
        if(err){
            console.log('Error in Buying the Book');
            return;
        }
        if(Task){
            Sell.uploadedimage(req,res,function(err){
                if(err){
                    console.log("............multer err",err);
                }   
                if(req.body.number.length===10){
                    Task.available="no";
                    Sell.create({
                        name: req.body.owner,
                        bookname: Task.bookname,
                        mrp: Task.mrp,
                        number: req.body.number,
                        address: req.body.address,
                        city: req.body.city,
                        state: req.body.state,
                        pincode: req.body.pincode,
                        email: req.body.email,
                        pickup:"yes" ,
                        available: "no",
                        user: req.user._id,
                        image:Task.image,
                        drop:"buy",
                        description:Task.description
                    },function(err,newList){
                        if(err){
                            console.log("Error in Creating a List")
                            return  res.redirect('back');
                        }
                        console.log('******', newList);
                        req.flash('success','Book Bought successfully ');
                        return  res.redirect('back');
                    })
                }else{
                    req.flash('error',' Please Enter a valid Contact Number of size 10');
                    return  res.redirect('back');
                }
            });
            Task.save();
        }
    });
}
module.exports.createnotes=function(req,res){
    // adding task to database 
    Notes.uploadednotes(req,res,function(err){
        if(err){
            console.log("............multer err",err);
            return  res.redirect('back');
        }
        Notes.create({
            name: req.body.owner,
            notes:Notes.notespath+'/'+req.file.filename
        },function(err,newList){
            if(err){
                console.log("Error in Creating a List")
                return  res.redirect('back');
            }
            console.log('******', newList);
            req.flash('success','Notes Uploaded successfully');
            return  res.redirect('back');
        })
    });
}
module.exports.sell=function(req,res){
    // adding task to database 
    Sell.uploadedimage(req,res,function(err){
        if(err){
            console.log("............multer err",err);
        }
        if(req.body.mrp==0){
            User.findById(req.user._id,function(err,user){
                let star=parseInt(user.donated);
                user.donated=star+1;
                user.save();
            });
        }
        if(req.body.number.length===10){
            Sell.create({
                name: req.body.owner,
                bookname: req.body.bookname,
                mrp: req.body.mrp,
                number: req.body.number,
                address: req.body.address,
                city: req.body.city,
                state: req.body.state,
                pincode: req.body.pincode,
                email: req.body.email,
                pickup:"yes" ,
                available: "yes",
                user: req.user._id,
                image:Sell.bookpath+'/'+req.file.filename,
                drop:"sale",
                description:req.body.description
            },function(err,newList){
                if(err){
                    console.log("Error in Creating a List")
                    return  res.redirect('back');
                }
                console.log('******', newList);
                if(newList.mrp==0){
                    req.flash('success','Congratulations, you just won a loyalty badge ⭐');
                }
                req.flash('success','Book Added for Sale successfully ');
                return  res.redirect('back');
            })
        }else{
            req.flash('error',' Please Enter a valid Contact Number of size 10');
            return  res.redirect('back');
        }
    });
}
module.exports.login=function(req,res){
    if(req.isAuthenticated()){
        res.render('home',{
            title: "Bookshala",
        });
        return;
    }
    res.render('index',{
        title: "Bookshala"
    });
    return;
}
module.exports.request=function(req,res){
    res.render('request',{
        title: "Bookshala",
    });
    return;
}
module.exports.otp=function(req,res){
    res.render('otp',{
        title: "Bookshala",
    });
    return;
}
module.exports.requestbook=function(req,res){
    req.flash('success',' Request sent successfully ');
    nodemailer.requestsender(req.user);
    User.find({}, function(err, Users){
        if (err)
            return res.redirect('back');
        if (Users){
            for(let i=0;i<Users.length;i++){
                if(Users[i].email==req.user.email)
                    continue;
                Users[i].requestername=req.body.owner;
                Users[i].requesternumber=req.body.number;
                Users[i].bookname=req.body.bookname;
                nodemailer.request(Users[i]);
            }
        }
    });
    return res.redirect('back');
}
module.exports.create=function(req,res){
    if (req.body.password != req.body.confirm_password){
        req.flash('error',' Password Not Matched ')
        return res.redirect('back');
    }
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}
        if (!user){
            if(req.body.admin==null){
                req.body.admin='No';
            }
            if(req.body.donated==null){
                req.body.donated=0;
            }
            Otp.findOne({email: req.body.email}, function(err, otpuser){
                if(err){console.log('error in finding user in signing up'); return}
                if(!otpuser){
                    let OTP=Math.floor(100000 + Math.random() * 900000);
                    req.body.otp=OTP;
                    Otp.create(req.body, function(err, otp){
                        if(err){console.log('error in creating otp while signing up'); return}
                        nodemailer.otp(otp);
                        req.flash('success',' Otp Sent Successfully!! ')
                        return res.redirect('back');
                    })
                }else{
                    req.flash('success',' Otp Already Sent');
                    return res.redirect('back');
                }
            });
        }else{
            req.flash('error',' User already exist Plz Sign-In ');
            return res.redirect('back');
        }
    });
}
module.exports.resend=function(req,res){
    Otp.findOne({email: req.body.email}, function(err, otpuser){
        if(err){console.log('error in finding user in signing up'); return}
        if(!otpuser){
            req.flash('error',' Please Send Otp First');
            return res.redirect('back');
        }else{
            Otp.findOneAndDelete({email:req.body.email},function(err){
                if(err){
                    console.log('error in deleting the User');
                    return res.redirect('back');
                }
            });
            Otp.create({
                email: otpuser.email,
                password: otpuser.password,
                name: otpuser.name,
                admin: otpuser.admin,
                donated: otpuser.donated,
                otp:Math.floor(100000 + Math.random() * 900000)
            },function(err,newOtp){
                if(err){
                    console.log(err,"Error in Creating a newotpUser")
                    return  res.redirect('back');
                }
                // console.log('******', newOtp);
                nodemailer.otp(newOtp);
                req.flash('success','New Otp Sent successfully ');    
                return res.redirect('back');    
            });
        }
    });
}
module.exports.enterotp=function(req,res){
    User.findOne({email: req.body.email}, function(err, user){
        if(err){console.log('error in finding user in signing up'); return}
        if (!user){
            Otp.findOne({email: req.body.email}, function(err, otpuser){
                if(err){console.log('error in finding user in signing up'); return}
                if(!otpuser){
                    req.flash('error',' Please Send Otp First');
                    return res.redirect('back');
                }else{
                    if(req.body.otp===otpuser.otp){
                        User.create({
                            email: otpuser.email,
                            password: otpuser.password,
                            name: otpuser.name,
                            admin: otpuser.admin,
                            donated: otpuser.donated,
                        },function(err,newUser){
                            if(err){
                                console.log("Error in Creating a User")
                                return  res.redirect('back');
                            }
                            console.log('******', newUser);
                            req.flash('success','Signed-Up successfully ');    
                            return res.redirect('back');         
                        })
                        Otp.findOneAndDelete({email:req.body.email},function(err){
                            if(err){
                                console.log('error in deleting the User');
                                return res.redirect('back');
                            }
                        })
                    }else{
                        req.flash('error','Wrong Otp Try Again ');
                        return res.redirect('back');
                    }
                }
            });
        }else{
            req.flash('error',' User already exist Plz Sign-In ');
            return res.redirect('back');
        }
    });
}
module.exports.createsession=function(req,res){
    req.flash('success',' Logged In Successfully ')
    return res.redirect('/');
}
module.exports.destroy=function(req,res){
    req.logout();
    req.flash('success',' Logged out Successfully ')
    res.redirect('index');
};

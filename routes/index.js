const express=require('express');
const db = require('../config/mongoose');
const passport = require('passport');
const router=express.Router();
router.use(express.urlencoded());
const controller=require('../controllers/homecontroller');
router.get('/',passport.checkAuthentication,controller.home);
router.get('/admin',passport.checkAuthentication,controller.home1);
router.get('/buy-book',passport.checkAuthentication,controller.buybook);
router.get('/sell-book',passport.checkAuthentication,controller.sellbook);
router.get('/notes',passport.checkAuthentication,controller.notes);
router.get('/request',passport.checkAuthentication,controller.request);
router.get('/index',controller.login);
router.get('/otp',controller.otp);
router.post('/create',controller.create);
router.post('/resend',controller.resend);
router.post('/enterotp',controller.enterotp);
router.post('/creat_notes',controller.createnotes);
router.post('/sell',controller.sell);
router.post('/requestbooks',controller.requestbook);
router.post('/pickup',controller.pickupdone);
router.post('/purchased',controller.purchased);
// use passport as a middleware to authenticate
router.post('/create-session', passport.authenticate(
    'local',
    {failureRedirect: '/index'},
), controller.createsession);
router.get('/signout',controller.destroy);
module.exports=router;
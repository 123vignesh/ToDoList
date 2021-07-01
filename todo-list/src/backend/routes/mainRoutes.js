var express=require("express");
var router=express.Router();
var Pages=require("../controllers/mainController")


router.route("/signin").get(Pages.redirectprofile,Pages.Signin);
router.route("/signup").get(Pages.redirectprofile,Pages.Signup);
router.route("/signout").get(Pages.Signout);
router.route("/signin").post(Pages.redirectprofile,Pages.SigninPost);
router.route("/signup").post(Pages.redirectprofile,Pages.SignupPost);
router.route("/").get(Pages.redirectSignup, Pages.Home);
router.route("/").post(Pages.Home);
router.route("/add").post(Pages.Add);
router.route("/crud").post(Pages.Crud);


module.exports=router;


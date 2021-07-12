import raw from "../../middleware/route.async.wrapper.mjs"
import express from "express"
import user_model from "../user/user.model.mjs"

const router = express.Router();

router.use(express.json())


const verifyAuth = (req,res,next)=>{
    if(req.session.user){
        next()
    }else{
        res.status(403).json({status:'unauthorized',payload:'You are unauthorized to access this route'})
    }
}

router.post('/', raw( async(req,res)=> {
    console.log(req.body,'body')
    const {userName,password} = req.body;
    //const user = await user_model.findById("60e77c2c7c3db43cb164ba6b");

    const userFromDb = await user_model.findOne({"userName": userName})
    .select(`_id 
    userName 
    password 
    role`);
    
    const userDataFromDb = userFromDb["_doc"];
    console.log("user from DB - ", userDataFromDb);
    console.log("user from DB - ", userDataFromDb.userName);
    console.log("---", userName, userDataFromDb.userName, userName == userDataFromDb.userName)
    if(userName == userDataFromDb.userName && password == userDataFromDb.password){
   
        const payload = {...userDataFromDb};
        delete payload.password;
        res.status(200).json({status:'you are login', user:payload})
    }else{
        res.status(403).json({status:'wrong user name or password'})
    }
}));
router.get('/api/logout',(req,res)=>{
    req.session.user = null;
    res.status(200).json({status:'You are logged out'})
})
router.get('/api/protected',verifyAuth,(req,res)=>{
    res.status(200).json({status:'OK',payload:'some sensitive data'})
})

export default router;
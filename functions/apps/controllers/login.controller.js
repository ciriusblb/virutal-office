
const authManagerModel = require('../models/auth.manager.model');

const loginController ={
    createCustomToken: (req,res)=>{
        authManagerModel.createCustomToken({uid:req.uid},(err,data)=>{
            if(err) return res.status(500).send({message: `Error al crear token firebase ${err}`})
            if (!data) return res.status(404).send({message: `Error al crear token firebase ${err}`})	
            res.status(200).json({
                ok:true,
                id:req.id,
                uid:req.uid,
                user:req.user,
                freepass:req.freepass,
                customToken:data.customToken
            });
        })
    },
    renewCustomToken: (req,res) =>{
        authManagerModel.createCustomToken({uid:req.uid},(err,data)=>{
            if(err) return res.status(500).send({message: `Error al crear token firebase ${err}`})
            if (!data) return res.status(404).send({message: `Error al crear token firebase ${err}`})	
            res.status(200).json({
                ok:true,
                uid:req.uid,
                customToken:data.customToken
            });
        })
    }
}
module.exports = loginController;

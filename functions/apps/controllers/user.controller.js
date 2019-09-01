const userModel = require('../models/user.model');


const userController ={
    getUser: async (req, res) => {
      try {
        const user = await userModel.getUser(req.params);
        res.status(201).json({
          ok: true,
          user
        });
      }
      catch(e){
        res.status(500).send({message: `Error getting user`, err: e})
      }
    },
    saveUser: async (req,res)=>{
      try {
        const results = await Promise.all([
          userModel.saveUser(req.body),
          userModel.pendingAccounts(req.body),
          userModel.accountHistory(req.body),
          userModel.uodateUserPoints(req.body.accounts)
        ]);
        res.status(201).json({
          ok: true,
          results
        });
      }
      catch(e){
        res.status(500).send({message: `Error getting afiliados`, err: e})
      }
    },
    editUser: function(req,res){
      userModel.editUser(req.body, (err, data) => {
        if(err) return res.status(500).send({message: `Error updating document ${err}`})
        if (!data) return res.status(404).send({message: `no se ha podido encontrar el elemento ${err}`})	
        res.status(201).json({
          ok: true,
          data
        });	
      })
      
    },
    getLevels: (req,res) =>{
      userModel.getLevels((err,data)=>{
        if(err) return res.status(500).send({message: `Error getting documents ${err}`})
        if (!data) return res.status(404).send({message: `no se ha podido encontrar los documentos ${err}`})	
        res.status(201).json(
          data
        );
      })
    }
}
module.exports = userController;

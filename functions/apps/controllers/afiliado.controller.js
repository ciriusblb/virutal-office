const afiliadoModel = require('../models/afiliado.model');


const afiliadoController ={
    pendingAccounts: (req, res) => {
      afiliadoModel.pendingAccounts(req.body, (err, data) => {
        if(err) return res.status(500).send({message: `Error creating afiliado`, err: err})
        if (!data) return res.status(404).send({message: `no se ha podido crear el afiliado`, err: err})			
        res.status(201).json({
          ok: true,
          data
        });
      })
    },
    getAffiliates: async (req, res) => {
      try {
        var getDocs = await afiliadoModel.getAffiliates(req.params);
        res.status(201).json({
              ok: true,
              getDocs
        });
      }
      catch(e){
        res.status(500).send({message: `Error getting afiliados`, err: e})
      }
    }
}
module.exports = afiliadoController;


const accountHistoryModel = require('../models/accountHistory.model');

const loginController ={
    accountHistoryUser: async (req,res) => {
        try {
            const result = await accountHistoryModel.accountHistoryUser(req.params);
            res.status(201).json({
                  ok: true,
                  result
            });
        }
        catch(e){
            res.status(500).send({message: `Error getting accounts`, err: e})
        }
    },
    putPaymentHistory: async (req, res) => {
        try {
            req.body.DNI = req.params.DNI;
            const result1 = await accountHistoryModel.putPaymentHistory(req.body);
            const result2 = await accountHistoryModel.getPaymentHistory(req.params);

            res.status(201).json({
                  ok: true,
                  result: result2
            });
        }
        catch(e){
            res.status(500).send({message: `Error setting and getting accounts`, err: e})
        }
    },
    getPaymentHistory: async (req, res) => {
        try {
            const result = await accountHistoryModel.getPaymentHistory(req.params);
            res.status(201).json({
                  ok: true,
                  result
            });
        }
        catch(e){
            res.status(500).send({message: `Error getting accounts`, err: e})
        }
    }
}
module.exports = loginController;

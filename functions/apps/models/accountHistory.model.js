
const firebaseAdmin = require('../../config/firebaseSdk/adminsdk');

const db = firebaseAdmin.firestore();

var accountHistory = {
	accountHistoryUser : async (data) => {
        var snapshot = await db.collection('historial de cuentas').where('DNI', '==', Number(data.DNI)).get();
        var history =[];
        snapshot.forEach(doc => {
            history.push({ id: doc.id, ...doc.data() });
        });
        return history;
    },
    putPaymentHistory: async (data)=>{
        var date = new Date();
        var n = new Date().setDate(date.getDate()+7);
        var seventhdate = new Date(n);
        var Id = data.DNI + '-' + date.getMonth() + '-' + date.getFullYear();
        var setDoc = await db.collection('historial de pago').doc(Id).set({
            DNI: Number(data.DNI),
            closingdate: seventhdate,
            month: date.getMonth(),
            openingdate: date,
            payment: data.payment
        });
         return {msj: 'actualizacion exitosa'};
    },
    getPaymentHistory: async (data)=>{
        var snapshot = await db.collection('historial de pago').where('DNI', '==', Number(data.DNI)).get();
        var paymentHistory =[];
        snapshot.forEach(doc => {
            paymentHistory.push({ id: doc.id, ...doc.data() });
        });
        return paymentHistory;
    }
}

module.exports = accountHistory;
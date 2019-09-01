const firebaseAdmin = require('../../config/firebaseSdk/adminsdk');

const db = firebaseAdmin.firestore();

const side = ["left", "right"];

var afiliadoModel = {
    pendingAccounts : (data,callback)=>{
        var addDoc = db.collection('cuentas pendientes').add({
            DNI: data.DNI,
            arm: data.arm,
            by: data.by,
            email: data.email,
            sponsor: {
                DNI: data.sponsor.DNI,
                lastname: data.sponsor.lastname,
                name: data.sponsor.name,
                rank: data.sponsor.rank,
                sponsor: data.sponsor.sponsor,
            }
        }).then(ref => {
            callback(null, {id:ref.id, email:data.email});
        }).catch((err) => {
            callback(err, null);
        });
    },
    getAffiliates: async (data) => {
        let DNI = Number(data.DNI); 
        var snapshot = await db.collection('usuarios').where('sponsor', '==', DNI).get();
        var afiliados =[];
        var arms={};
        snapshot.forEach(doc => {
            let datos = {
                DNI: doc.data().DNI, 
                name: doc.data().name, 
                lastname: doc.data().lastname, 
                arm: doc.data().arm, 
                rank: doc.data().rank,
                sponsor: doc.data().sponsor,
                afiliados:[]
            };
            arms[side[doc.data().arm]] = true;
            afiliados.push({ id: doc.id, ...datos });
        });
        return {size: snapshot.size, DNI: data.DNI, afiliados, arms};
    }
}


module.exports = afiliadoModel;
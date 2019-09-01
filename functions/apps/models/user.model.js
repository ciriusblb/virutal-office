const firebaseAdmin = require('../../config/firebaseSdk/adminsdk');

const db = firebaseAdmin.firestore();

const switchRankPoints= function(rank, points) {
    let returnRank = rank;
    let returnPoints = points;
    switch (rank) {
      case 'MASTER': if(points >= 100) {returnRank = 'EJECUTIVO'; returnPoints=0}; break;
      case 'EJECUTIVO': if(points >= 100) {returnRank = 'PLATA'; returnPoints=0}; break;
      case 'PLATA': if(points >= 100) {returnRank = 'ORO', returnPoints=0}; break;
      case 'ORO': returnRank = 'ORO'; break;
    }
    return {returnRank, returnPoints};
}
var userModel = {
    getUser: async (data) => {
        var userRef = await db.collection('usuarios').doc(data.id).get();
        return { id: userRef.id, ...userRef.data() }; 
    },
    editUser: (data,callback) => {
        var editDoc = db.collection('usuarios').doc(data.id).update({
            DNI: data.DNI || null,
            address: data.address || '',
            city: data.city || '',
            country: data.country || '',
            email: data.email,
            lastname: data.lastname || '',  
            name: data.name || '',
            password: data.password,
            phoneNumber: data.phoneNumber,
            photoURL: data.photoURL || 'https://firebasestorage.googleapis.com/v0/b/virtual-office-cbdd8.appspot.com/o/assets%2Fno-img.jpg?alt=media&token=cf6b1e66-b4d8-4b06-8b9e-10d1e9fc5440',
            points: data.points || 0,
            postalCode: data.postalCode || '',
            rank: data.rank || '',
            sponsor: data.sponsor,
            arm: data.arm
        }).then(ref => {
          data.password = undefined;
          callback(null,data);
        }).catch((err)=>{
            callback(err, null);
        })
    },
    getLevels: (callback) => {
        var getDocs = db.collection('niveles').get().then(snapshot =>{
            if(snapshot.empty){
                callback(null,err);          
            }
            var data =[];
            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() });
            });
            callback(null,data);
        }).catch(err => {
            callback(null,err);
        });

            
    },
    saveUser: async (data) => {
        await db.collection('usuarios').add({
            DNI: data.DNI,
            address: '',
            city: '',
            country: '',
            email: data.email,
            lastname: data.lastname,  
            name: data.name,
            password: data.password,
            phoneNumber: data.phoneNumber,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/virtual-office-cbdd8.appspot.com/o/assets%2Fno-img.jpg?alt=media&token=cf6b1e66-b4d8-4b06-8b9e-10d1e9fc5440',
            points: 0,
            postalCode: '',
            rank: 'MASTER',
            sponsor: data.sponsor.DNI,
            arm: data.arm
        });
        return {msj: 'usuario creado'}; 
    },
    pendingAccounts: async (data) => {
        await db.collection('cuentas pendientes').doc(data.refId).delete();
        return {msj: 'cuenta pendiente elimnada'};
    },
    accountHistory: async (data) => {
        var datos = data.accounts;
        for (let i = 0; i < datos.length; i++) {
            await db.collection('historial de cuentas').add({  
                DNI: datos[i].DNI,
                by: datos[i].by,
                date: new Date(),
                money: datos[i].money,
                points: datos[i].points,
                sponsored: data.DNI,
             });
        }
        return {msj:'registros exitoso'};
    },
    uodateUserPoints: async (data) => {
        for (let i = 0; i < data.length; i++) {
            let changes = switchRankPoints(data[i].rank, data[i].userPoints);
            await db.collection('usuarios').doc(data[i].id).update({
                points: changes.returnPoints,
                rank: changes.returnRank
            });
        }
        return {msj:'actualizaciones exitosas'};
    }
}

module.exports = userModel;



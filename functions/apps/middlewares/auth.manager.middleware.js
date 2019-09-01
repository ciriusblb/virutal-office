const bcrypt = require('bcryptjs');


const firebaseAdmin = require('../../config/firebaseSdk/adminsdk');

const db = firebaseAdmin.firestore();
db.settings({timestampsInSnapshots: true})

var switchRank= function(rank) {
    let points = 0;
    let money = 0;
    switch (rank) {
      case 'MASTER': points = 5; money = 6; break;
      case 'EJECUTIVO': points =  10; money = 5; break;
      case 'PLATA': points = 15; money = 4; break;
      case 'ORO': points = 20; money = 3; break;
    }
    return {points, money};
  }
var authManagerMiddleware = {
    getUserByEmail: (req,res, next) =>{
        var email = req.body.email;
        firebaseAdmin.auth().getUserByEmail(email)
            .then(function(userRecord) {
                req.uid=userRecord.uid;
                next();
            })
            .catch(function(error) {
                res.status(500).send({error: error, message: `la cuenta del usuario no esta registrada`})
            });
    },
    verifySponsorAndHashSync : (req, res, next) =>{
        var cuentasRef = db.collection('cuentas pendientes');
        var query = cuentasRef
            .where('email', '==', req.body.email)
            .where('DNI', '==', req.body.sponsor)
            .get()
            .then(snapshot => {
                if(snapshot.empty){
                    res.status(500).send({message: `Credenciales: DNI o email incorrecto`})
                }
                snapshot.forEach(doc => {
                    req.body.refId = doc.id;
                    req.body.arm = doc.data().arm;
                    req.body.sponsor = doc.data().sponsor;
                    req.body.password = bcrypt.hashSync(req.body.password,10);
                    next();
                });
            })
            .catch(err => {
                res.status(500).send({message: `Error getting documents`, error: err})
            });
    },
    updateUser: (req,res,next) =>{
        var uid = req.uid;
        var body = req.body;
        var displayName = body.name + " " + body.lastname;
        firebaseAdmin.auth().updateUser(uid, {
            email: body.email,
            phoneNumber: body.phoneNumber,
            password: body.password,
            emailVerified: true,
            displayName: displayName || body.email,
            photoURL: body.photoURL || 'https://firebasestorage.googleapis.com/v0/b/virtual-office-cbdd8.appspot.com/o/assets%2Fno-img.jpg?alt=media&token=cf6b1e66-b4d8-4b06-8b9e-10d1e9fc5440',
            disabled: false
        }).then(function(userRecord) {
            next();
        }).catch(function(error) {
            res.status(500).send({message: `se ha producido un error updating user`, error: error})
        });
    },
    getDoc: (req,res,next)=>{
        const id = req.params.id;
        var userRef = db.collection('usuarios').doc(id);
        var getDoc = userRef.get()
            .then(doc => {
                if (!doc.exists) {
                    res.status(500).send({message: `El usuario no esta registrado`});
                    return;
                } else {
                    if(req.body.newPassword){
                        if(!bcrypt.compareSync(req.body.password, doc.data().password)){
                            res.status(404).send({message: `Password incorrecto`});
                            return;
                        }
                        req.body.password = bcrypt.hashSync(req.body.newPassword,10);
                        req.body.newPassword = undefined;
                    }else{
                        req.body.password = doc.data().password;
                    }
                    next();
                }
            })
            .catch(err => {
                res.status(500).send({message: `Error getting document`, error: err})
            });
    },
    getUser: (req,res,next)=>{
        var body = req.body;
        var usuariosRef = db.collection('usuarios');
        var query = usuariosRef.where('email', '==', body.email).get()
            .then(snapshot => {
                if(snapshot.empty){
                    res.status(500).send({message: `El usuario no esta registrado`})
                    return;
                }
                snapshot.forEach(doc => {
                    if( !bcrypt.compareSync(body.password, doc.data().password)){
                        res.status(500).send({message: `Credenciales incorrectas email - password`});
                        return;
                    }
                    req.user = doc.data();
                    req.user.password=undefined;
                    req.id=doc.id;
                    next();
                });
            })
            .catch(err => {
                res.status(500).send({message: `Error getting documents`, error: err})
            });
    },
    createUser: (req, res, next) => {
        firebaseAdmin.auth().createUser({
            email: req.body.email,
            emailVerified: false,
            photoURL: 'https://firebasestorage.googleapis.com/v0/b/virtual-office-cbdd8.appspot.com/o/assets%2Fno-img.jpg?alt=media&token=cf6b1e66-b4d8-4b06-8b9e-10d1e9fc5440',
            disabled: false,
        }).then(userRecord => {
            next();
        })
        .catch(err => {
            res.status(500).send({message: `Error creating account`, error: err});
            return;
        });
    },
    setUsersAccounts: async (req, res, next) => {
        let DNI = req.body.sponsor.DNI;
        var cuentas = [];
        while (DNI) {
            var usuariosRef = await db.collection('usuarios').where('DNI', '==', DNI).get();
            if(usuariosRef.empty){
                break;
            }
            let comission = 0;
            usuariosRef.forEach(doc => {
                if(req.body.sponsor.DNI == doc.data().DNI){
                    comission = 40;
                }
                cuentas.push({
                    id: doc.id,
                    DNI: doc.data().DNI, 
                    points: switchRank(doc.data().rank).points, 
                    money: switchRank(doc.data().rank).money,
                    userPoints:  doc.data().points + switchRank(doc.data().rank).points + comission,
                    by: 'Afiliación',
                    rank: doc.data().rank, 
                });
                DNI = doc.data().sponsor;
            });
        }
        req.body.accounts = cuentas; 
        next();
    },
    verifyIdToken: (req,res,next) => {
        var IdToken = req.query.IdToken;
        firebaseAdmin.auth().verifyIdToken(IdToken)
            .then(function(decodedToken) {
                var uid = decodedToken.uid;
                req.uid = uid;
                next();
            }).catch(function(error) {
                if (error.code == 'auth/id-token-revoked') {
                    res.status(500).send({message: `la cuenta fue inhabilitada por un administrador`, error : error});
                  }
                if(error){
                    res.status(500).send({message: `se ha producido un error en la verificacion de token`, error : error});
                }
            });
    }
}

    


module.exports = authManagerMiddleware;
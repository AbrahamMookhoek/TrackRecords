import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth';
import express from 'express';
const router = express.Router()

router.use('/', async (req, res) => {
    console.log(req.query)
    console.log(req.path)
    
    let email = req.query.email
    let password = req.query.password

    const auth = getAuth();

    await createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        console.log(user)

        onAuthStateChanged(auth, (user) => {
            if (user){
                res.send("LOGGED IN")
                return
            } else {
                res.send("USER LOGGED OUT")
                return
            }
        })
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
    });
})

export default router
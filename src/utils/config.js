import dotenv from 'dotenv'

dotenv.config('')

export default {
    port:process.env.PORT,
    mongoUrl:process.env.MONGO_URL,
    adminName:process.env.ADMIN_NAME,
    adminPassword:process.env.ADMIN_PASSWORD,
    privateKey:process.env.PRIVATE_KEY,
    clientID: process.env.CLIENT_ID,
    clientSecret:process.env.CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
    secretOrKey: process.env.SECRET_OR_KEY,
}
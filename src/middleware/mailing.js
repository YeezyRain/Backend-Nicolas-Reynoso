import nodemailer from 'nodemailer';

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 8080,
    auth:{
        user: "ReynosoNicolas1111@gmail.com",
        pass: "kpqulkmcravctvhk"
    },
    tls: {
        rejectUnauthorized: false
      }
})
const html = ''

export default transport
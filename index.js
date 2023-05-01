const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const path = require('path')
const nodemailer = require('nodemailer');

const app = express()
const porta = 443

app.use(session({ secret: '1234567890' }))

app.use(bodyParser.urlencoded({ extended: true }))

let login = 'admin'
let senha = '1234'

app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html');
app.set('views', path.join(__dirname, './'))

app.get('/', (req, res) => {
  if (req.session.login) {
    res.render('logado')
    console.log('Usuário logado: ' + req.session.login)
  }
  else {
    res.render('home')
  }
})

app.post('/', (req, res) => { // apos usuário logado
  if (req.body.password == senha && req.body.login == login) { // requisição sucesso, usuario redirecionado para pg logado
    console.log('Usuário logado com sucesso!')
    req.session.login = login
    res.render('logado')
  }
  else { // se não, voltara para pagina home
    res.render('home')
  }
})

// e-mail começa aqui 

app.get('/email', (req, res) => {
  res.render('email')
})

app.get('/sendemail', async (req, res) => {

  var transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "c3ffbc25089b9e",
      pass: "ca8203ce7d0455"
    }
  });

  var message = {
  from: "sender@server.com",
  to: "receiver@sender.com",
  subject: "Enviando e-mail com nodemailer",
  text: "Olá, testando envio de e-mail",
  html: "<p>Está é uma mensagem de teste</p>"
};

  transport.sendMail(message, function(err) {
    if (err)
      return res.status(400).json({
        erro: true,
        mensagem: 'Erro: e-mail não enviado!'
      })
    else
      return res.json({
        erro: false,
        mensagem: 'E-mail enviado com sucesso!'
      })
  })

})

app.listen(porta, () => { console.log('Servidor Rodando!') })
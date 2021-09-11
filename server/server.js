import express from 'express'

const app = express()

app.get('/', (req, res) => {
  console.log('request received!')
  const message= {
    sender: 'LF Verissimo',
    message: 'Olá Mundão!'
  }
  res.json(message)
})

app.listen(process.env.PORT, () => {
  console.log(`Server app listening at http://localhost:${process.env.PORT}`)
})

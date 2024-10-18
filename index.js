const express = require('express')
const fs = require('fs')

const app = express()
const PORT = 3000

app.use(express.json())

let users = []

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

fs.readFile('users.json', 'utf8', (err, data) => {
  if (!err) {
    users = JSON.parse(data);
  }
})

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.get('/users', (req, res) => {
  res.json(users)
})

app.post('/users', (req, res) => {
  const newUser = req.body
  newUser.id = getRandomInt(1, 1000)
  users.push(newUser)

  fs.writeFile('users.json', JSON.stringify(users), (err) => {
    if (err) {
      res.status(500).send('Error saving user')

      return
    }

    res.json(users)
  })
})

app.put('/users/:id', (req, res) => {
  const userId = +req.params.id
  const updatedUser = req.body

  const userIndex = users.findIndex(user => user.id === userId)

  if (userIndex === -1) {
    res.status(404).send('User not found')

    return
  }

  users[userIndex] = updatedUser

  fs.writeFile('users.json', JSON.stringify(users), (err) => {
    if (err) {
      res.status(500).send('Error updating user')

      return
    }

    res.json(users)
  })
})

app.delete('/users/:id', (req, res) => {
  const userId = +req.params.id

  const usersNew = users.filter(user => user.id !== userId)

  fs.writeFile('users.json', JSON.stringify(usersNew), (err) => {
    if (err) {
      res.status(500).send('Error deleting user')

      return
    }

    res.json(usersNew)
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

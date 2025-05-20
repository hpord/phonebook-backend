require('dotenv').config()
const express = require('express')
const app = express()
const Person = require('./models/person')
const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(express.static('dist'))

app.get('/', (request, response) => {
    response.send('<h1>Hello Persons!</h1>')
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    response.send(
        `Phonebook has info for ${persons.length} ${persons.length == 1 ? 'person' : 'people'}\
        <br /> <br />\
        ${new Date().toString()}`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
  
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})
  
app.post('/api/persons', (request, response) => {
    const name = request.body.name ? request.body.name.trim() : undefined
    const number = request.body.number ? request.body.number.trim() : undefined
  
    if (!name || !number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }

    /*if (persons.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }*/
  
    const person = new Person({
        name,
        number,
    })
  
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
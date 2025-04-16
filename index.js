const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

/*morgan.token('body',  (req) => (
    JSON.stringify(req.body)
))*/

app.use(express.json())
app.use(morgan('tiny'))
//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/', (request, response) => {
    response.send('<h1>Hello Persons!</h1>')
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
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

const generateId = () => {
    let id
    do {
        id = Math.floor(Math.random() * 100);
    } while (persons.some(p => p.id === id))

    return id
}
  
app.post('/api/persons', (request, response) => {
    const name = request.body.name ? request.body.name.trim() : undefined
    const number = request.body.number ? request.body.number.trim() : undefined
  
    if (!name || !number) {
        return response.status(400).json({ 
            error: 'name or number missing' 
        })
    }

    if (persons.some(p => p.name.toLowerCase() === name.toLowerCase())) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        })
    }
  
    const person = {
        name,
        number,
        id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
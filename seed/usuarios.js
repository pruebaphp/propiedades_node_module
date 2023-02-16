import bcrypt from 'bcrypt'

const usuarios = [
    {
        nombre:'Juan',
        email: 'juan@juan.com',
        confirmado:1,
        password: bcrypt.hashSync('password',10)
    },
    {
        nombre:'Alfonso',
        email: 'pruebaphpcode@gmail.com@',
        confirmado:1,
        password: bcrypt.hashSync('alfonso',10)
    }
]

export default usuarios
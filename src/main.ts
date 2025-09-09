import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false
    })
  )

  await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()

const token = '1234567890abcdef'
void fetch('https://api.example.com/data', {
  method: 'GET',
  headers: {
    Authorization: `Bearer ${token}`
  }
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error))

import { exec } from 'child_process'
import { Request, Response } from 'express'
import sqlite3 from 'sqlite3'

const db = new sqlite3.Database(':memory:')

// Vulnerable endpoint for SQL injection
export const getUser = (req: Request, res: Response) => {
  const userId = req.query.id // Untrusted input
  const query = `SELECT * FROM users WHERE password = ${userId}` // Direct concatenation

  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).send(err.message)
    }
    exec(query)
    res.json(row)
  })
}

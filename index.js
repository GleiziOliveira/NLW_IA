import cors from "cors"
import express from "express"
import { convert } from "./convert.js"
import { download } from "./download.js"
import { transcribe } from "./transcribe.js"
import { summarize } from "./summarize.js"

const app = express()
app.use(express.json())
app.use(cors())

app.get("/summary/:id", async (request, response) => {
  try {
    await download(request.params.id)
    const audioConverted = await convert()
    const result = await transcribe(audioConverted)
    return response.json({ result })
  } catch (error) {
    console.error(error) // Use console.error para erros
    return response.status(500).json({ error: "Erro interno do servidor" })
  }
})

app.post("/summary", async (request, response) => {
  try {
    const result = await summarize(request.body.text)
    return response.json({ result })
  } catch (error) {
    console.error(error) // Use console.error para erros
    return response.status(500).json({ error: "Erro interno do servidor" })
  }
})

app.listen(3333, () => {
  console.log("Servidor está em execução na porta 3333")
})

// a ordem importa muito então tem que fazer a const express depois app.use

// () => isso é uma arow function e elas se auto executam

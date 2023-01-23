import express, { Request, Response } from 'express'
import cors from 'cors'
import { db } from './knex'


const app = express()

app.use(cors())
app.use(express.json())

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`)
})

app.get("/ping", async (req: Request, res: Response) => {
    try {
        res.status(200).send({ message: "Pong!" })
    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})



app.get("/bands", async (req: Request, res: Response) => {
    try {
        
        const result = await db.raw(
            `
            SELECT * FROM bands;
            
            `
        )

        res.status(200).send({bandas: result})



    } catch (error) {
        console.log(error)

        if (req.statusCode === 200) {
            res.status(500)
        }

        if (error instanceof Error) {
            res.send(error.message)
        } else {
            res.send("Erro inesperado")
        }
    }
})

app.post("/bands", async (req: Request, res: Response) => {
    try {

        const {id, name} = req.body

        if(typeof id !== "string"){
            res.status(400)
            throw new Error("id inválido, deve ser uma string")
        }

        if(typeof name !== "string"){
            res.status(400)
            throw new Error("'name' inválido deve ser uma string");
        }

        if(id.length <1 || name.length < 1){
            res.status(400)
            throw new Error("'id' ou 'name' devem ter no minimo 1 caractere")
        }

        await db.raw(`

        INSERT INTO bands(id, name)
        VALUES("${id}", "${name}")
        
        
        
        
        `)

        res.status(200).send(`${name} cadastrada com sucesso`)




        
    } catch (error: any) {

        console.log(error)

        if(req.statusCode === 200){
            res.status(500)
        }

        if(error instanceof Error){
            res.send(error.message)
        }else{
            res.send("Erro inesperado;")
        }
        
    }
})


app.put("/bands/:id", async (req: Request, res: Response) => {

   try {

    const id = req.params.id

    const newId = req.body.id
    const newName = req.body.name


    if(newId !== undefined){
        if(typeof  newId !== "string"){
            res.status(400)
            throw new Error("Id deve ser uma string")
        }

        if(newId.length < 2){
            res.status(400)
            throw new Error("id deve possuir no minimo 2 caractere")
        }
    }

    if(newName !== undefined){
        if(typeof newName !== "string"){
            res.status(400)
            throw new Error("'NAME' deve ser uma string")
        }

        if(newName.length < 2){
            res.status(400)
            throw new Error("'NAME' deve ter no minimo 2 caracteres")
        }
    }


    const [bands] = await db.raw(
        `

            SELECT * FROM bands
            WHERE id = "${id}"
        
        
        `
    )

    if(bands){

        await db.raw(`

            UPDATE bands 
            SET
                id = "${newId || bands.id}",
                name = "${newName || bands.name}"

            WHERE
                id = "${id}";
        
        
        
        `)

        res.status(200).send("Banda editada com sucesso")

    }else{
        res.status(400)
        throw new Error("id não encontrada")
    }
    
   } catch (error: any) {

    console.log(error)

    if(req.statusCode === 200){
        res.status(500)
    }

    if(error instanceof Error){
        res.send(error.message)
    }else{
        res.send("Erro inesperado;")
    }
    
   }
})
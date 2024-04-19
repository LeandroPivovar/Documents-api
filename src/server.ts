import fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

const server = fastify()

server.register(cors, { })

server.get('/content', async (request, reply)=>{
    const content = [
        {
          type: "paragraph",
          content: "Welcome to this demo!",
        },
        {
          type: "heading2",
          content: "This is a heading block",
        },
        {
          type: "paragraph",
          content: "This is a paragraph block",
        },
        {
          type: "paragraph",
        },
      ]
      console.log(content)
    reply.send(content)
})

server.post('/content', async (request, reply) => {
  const { blocks } = request.body;
  const arrBlocks = JSON.parse(blocks);

  for (const block of arrBlocks) {
    try {
      const result = await prisma.content.create({
        data: {
          type: block.type,
          text: block.content,
        },
      });
      console.log('Created content:', result);
    } catch (error) {
      console.error('Error creating content:', error);
    }
  }
});
server.post('/document', async (request, reply)=>{

  const {title} = request.body
  const document =  await prisma.documents.create({
    data:{
      title
    }
  })

  reply.send(document)
})
server.get('/document', async (request, reply)=>{

  const documents =  await prisma.documents.findMany()

  reply.send(documents)
})
server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`Server listening at ${address}`)
})
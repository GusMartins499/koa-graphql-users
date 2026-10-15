import { createApp } from './app.ts'

const port = Number(process.env.PORT ?? 3333)

createApp().listen(port, () => {
  console.log(`http://localhost:${port}/graphql`)
})

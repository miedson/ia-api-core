import fastifyCors from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import ScalarApiReference from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod'
import 'dotenv/config'
import aiRoutes from "./routes/ai";

const app = fastify().withTypeProvider<ZodTypeProvider>()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // credentials: true,
})

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'IA API CORE',
      description: 'API documentation for my IA core service',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

app.register(ScalarApiReference, {
  routePrefix: '/docs'
})

app.register(aiRoutes);

app.listen({
  port: Number(process.env.APP_PORT) || 3000,
  host: '0.0.0.0'
}).then(() => {
  console.log(`Server is running on http://${process.env.APP_HOST}:${process.env.APP_PORT}`)
  console.log(`Swagger docs available at http://${process.env.APP_HOST}:${process.env.APP_PORT}/docs`)
})

export default app

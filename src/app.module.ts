import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { envSchema } from './helpers/environment'
import { AppContainerModule } from './modules/app-container.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: (config: Record<string, unknown>) => {
        const parsed = envSchema.parse(config)
        return parsed
      }
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const graphqlPlayground = configService.get<boolean>(
          'GRAPHQL_PLAYGROUND',
          false
        )
        const introspection = await Promise.resolve(graphqlPlayground)
        const path = '/graphql'

        return {
          autoSchemaFile: 'schema.gql',
          installSubscriptionHandlers: true,
          useGlobalPrefix: false,
          path,
          playground: graphqlPlayground,
          debug: false,
          graphiql: graphqlPlayground,
          introspection
        }
      },
      inject: [ConfigService]
    }),
    AppContainerModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

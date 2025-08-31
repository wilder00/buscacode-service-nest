import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
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
          introspection,
          formatError: (error) => {
            const originalError =
              error.extensions?.originalError ?? new Error(error.message)

            return {
              ...error,
              extensions: undefined,
              error: originalError
            }
          }
        }
      },
      inject: [ConfigService]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: false
        } satisfies TypeOrmModuleOptions
      },
      inject: [ConfigService]
    }),
    AppContainerModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}

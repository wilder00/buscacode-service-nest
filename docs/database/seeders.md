# Seeders

## How to use

After run migrations, you can run seeders to populate the database.

```bash
pnpm run seed:dev ALL
```

You can run a specific seeder:

```bash
pnpm run seed:dev users
```

You can run multiple seeders:

```bash
pnpm run seed:dev users,categories
```

You can run seeders for production:

```bash
pnpm run seed:prod ALL
```

It will run just production seeders

```bash
pnpm run seed:prod categories
```

## Create a seeder

create a file in `src/database/seeders/develop` or `src/database/seeders/productions` with the schema of the seeder `<seeder-name>.seeder.ts` inside create a function called `<seederName>Seeder` that receive a `DataSource` as parameter and return a `Promise<void>`

```typescript
export const seederNameSeeder = async (dataSource: DataSource) => {
  const repo = dataSource.getRepository(YourEntity)
  const entity = new YourEntity()
  await repo.save(entity)
}
```

to run de seeder you can use the command:

```bash
pnpm run seed:dev seederName
```

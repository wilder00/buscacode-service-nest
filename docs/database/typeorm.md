# Database with typeorm

Mejor y más detalles en [typeorm document](https://typeorm.io/docs/advanced-topics/using-cli#run-migrations)

### Apply migration

```bash
pnpm run migration:create src/database/migrations/CreateCurrencyTable
pnpm typeorm migration:create src/database/migrations/CreateCurrencyTable
```

### Apply migration

```bash
pnpm typeorm migration:run -d src/database/typeorm.config.ts
```

### Show migration

```bash
pnpm typeorm migration:show  -d src/database/typeorm.config.ts
```

### revert migrations

```bash
pnpm typeorm migration:revert -d src/database/typeorm.config.ts
```

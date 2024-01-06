# nestjs-prisma-codegen

```
npx nestjs-prisma-codegen ResourceName
```

# nestjs-prisma-codegen 🚀🦖

This package takes your resource name and generates all the tedious NestJS types that you'd otherwise write by hand.

# Usage 🧙‍♂️💼

No complicated spells or potions here. In your src/ directory, Just run the script with the required model name.

```
npx nestjs-prisma-codegen --graphql User
```

```
├── common
│   ├── auth
│   │   ├── auth.decorator.ts
│   │   ├── auth.guard.ts
│   │   └── util.ts
│   ├── dtos
│   │   └── common.input.ts
│   ├── prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── types
│       └── index.ts
├── models
│   └── users
│       ├── dtos
│       │   ├── create-user.input.ts
│       │   ├── find.args.ts
│       │   ├── order-by.args.ts
│       │   ├── update-user.input.ts
│       │   └── where.args.ts
│       ├── entity
│       │   └── user.entity.ts
│       ├── users.module.ts
│       ├── users.resolver.ts
│       └── users.service.ts
```

```
npx nestjs-prisma-codegen --rest User
```

```
.
├── common
│   ├── auth
│   │   ├── auth.decorator.ts
│   │   ├── auth.guard.ts
│   │   └── util.ts
│   ├── dtos
│   │   └── common.dto.ts
│   ├── prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── types
│       └── index.ts
├── models
│   └── users
│       ├── dtos
│       │   ├── create.dto.ts
│       │   ├── query.dto.ts
│       │   └── update.dto.ts
│       ├── entity
│       │   └── user.entity.ts
│       ├── users.controller.ts
│       └── users.module.ts
```

```
npx nestjs-prisma-codegen --complete User
```

```
├── common
│   ├── auth
│   │   ├── auth.decorator.ts
│   │   ├── auth.guard.ts
│   │   └── util.ts
│   ├── dtos
│   │   ├── common.dto.ts
│   │   └── common.input.ts
│   ├── prisma
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   └── types
│       └── index.ts
├── models
│   └── users
│       ├── graphql
│       │   ├── dtos
│       │   │   ├── create-user.input.ts
│       │   │   ├── find.args.ts
│       │   │   ├── order-by.args.ts
│       │   │   ├── update-user.input.ts
│       │   │   └── where.args.ts
│       │   ├── entity
│       │   │   └── user.entity.ts
│       │   ├── users.resolver.ts
│       │   └── users.service.ts
│       ├── rest
│       │   ├── dtos
│       │   │   ├── create.dto.ts
│       │   │   ├── query.dto.ts
│       │   │   └── update.dto.ts
│       │   ├── entity
│       │   │   └── user.entity.ts
│       │   └── users.controller.ts
```

Then you can implement the input types with the help of typescript. Also the custom RestrictProperties type will always keep the nest types in sync with the prisma schema.

# Prisma module

For creating the prisma module and service, refer to the documentation https://docs.nestjs.com/recipes/prisma.

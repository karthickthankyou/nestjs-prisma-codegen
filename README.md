# nestjs-prisma-codegen

```
npx nestjs-prisma-codegen ResourceName
```

# nestjs-prisma-codegen 🚀🦖

This package takes your resource name and generates all the tedious NestJS types that you'd otherwise write by hand.

# Usage 🧙‍♂️💼

No complicated spells or potions here. In your src/ directory, Just run:

```
npx nestjs-prisma-codegen ResourceName
```

You will get these files generated.

```
├── common
│   ├── dtos
│   │   └── common.input.ts
├── models
│   └── users
│       ├── dto
│       │   ├── create-user.input.ts
│       │   ├── find.args.ts
│       │   ├── order-by.args.ts
│       │   ├── update-user.input.ts
│       │   └── where.args.ts
│       ├── entities
│       │   └── user.entity.ts
│       ├── users.module.ts
│       ├── users.resolver.ts
│       └── users.service.ts
```

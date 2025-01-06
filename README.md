# UniNet

Diploma final project

# Running Database

:warning: It's important for the project to run.

Make sure you're on root directory of the project

```bash
docker compose up -d
```

# Running apps in this repo

:warning: PNPM package manager should be installed :)

Easy to install [Link to installation manual](https://pnpm.io/installation):

```bash
wget -qO- https://get.pnpm.io/install.sh | sh -
```

## Running both apps

```bash
pnpm dev
```

## Running Front end Only

```bash
pnpm --filter frontend start
```

## Running Back end Only

```bash
pnpm --filter backend start
```

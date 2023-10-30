# http2

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Enable https

```bash
  openssl req -new -newkey rsa:2048 -new -nodes -keyout key.pem -out csr.pem
  openssl x509 -req -days 365 -in csr.pem -signkey key.pem -out server.crt
```

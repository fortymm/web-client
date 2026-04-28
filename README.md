# FortyMM web client

The web client for FortyMM — built with Vite, React, TypeScript, TanStack Router, and Tailwind.

## Develop

```
npm install
npm run dev
```

Other scripts:

- `npm run build` — production build to `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run ESLint
- `npm run typecheck` — generate the router tree and type-check

## Self-host

A prebuilt image is published to GitHub Container Registry on every push to `main`:

```
docker run -d --name fortymm -p 8080:80 ghcr.io/fortymm/web-client:latest
```

Then visit http://localhost:8080.

Images are multi-arch (`linux/amd64`, `linux/arm64`). Tags:

- `latest` — tip of `main`
- `sha-<short-sha>` — pinned to a specific commit
- `v1.2.3`, `1.2`, `1` — semver tags for released versions

### docker-compose.yml

```yaml
services:
  web:
    image: ghcr.io/fortymm/web-client:latest
    restart: unless-stopped
    ports:
      - "8080:80"
```

### Behind a reverse proxy

The bundle calls the API at the relative path `/api/*`, so your reverse proxy
must route `/api/*` to the FortyMM API and everything else to this container.

Caddy:

```
fortymm.example.com {
    handle /api/* {
        reverse_proxy api.internal:4001
    }
    handle {
        reverse_proxy localhost:8080
    }
}
```

nginx:

```
server {
    listen 443 ssl;
    server_name fortymm.example.com;

    location /api/ {
        proxy_pass http://api.internal:4001/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

The trailing slash on `proxy_pass http://api.internal:4001/` strips the
`/api/` prefix so the upstream sees `/v1/...`. Terminate TLS at your reverse
proxy — the container itself serves plain HTTP on port 80.

### Build the image locally

```
docker build -t fortymm-web-client:dev .
docker run --rm -p 8080:80 fortymm-web-client:dev
```

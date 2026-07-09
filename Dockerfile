# ---- Base ----
FROM node:22-alpine AS base

# ---- Dependencies ----
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ---- Builder ----
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# These are needed at BUILD time for Next.js to generate static pages correctly.
# Pass them in via --build-arg during docker build.
ARG MONGODB_URI
ARG WORKOS_CLIENT_ID
ARG WORKOS_API_KEY
ARG WORKOS_COOKIE_PASSWORD
ARG NEXT_PUBLIC_WORKOS_REDIRECT_URI
ARG CLOUDINARY_CLOUD_NAME
ARG CLOUDINARY_API_KEY
ARG CLOUDINARY_API_SECRET

ENV MONGODB_URI=$MONGODB_URI
ENV WORKOS_CLIENT_ID=$WORKOS_CLIENT_ID
ENV WORKOS_API_KEY=$WORKOS_API_KEY
ENV WORKOS_COOKIE_PASSWORD=$WORKOS_COOKIE_PASSWORD
ENV NEXT_PUBLIC_WORKOS_REDIRECT_URI=$NEXT_PUBLIC_WORKOS_REDIRECT_URI
ENV CLOUDINARY_CLOUD_NAME=$CLOUDINARY_CLOUD_NAME
ENV CLOUDINARY_API_KEY=$CLOUDINARY_API_KEY
ENV CLOUDINARY_API_SECRET=$CLOUDINARY_API_SECRET

RUN npm run build

# ---- Runner (final production image) ----
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
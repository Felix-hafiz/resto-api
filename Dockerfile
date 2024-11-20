FROM node:18.17.1-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR "/app"
COPY . .

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build 

FROM base AS deps 
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base
COPY --from=deps /app/node_modules ./node_modules/
COPY --from=build /app/build ./build/

ENV NODE_ENV=production

#change ownership of log folder and limit permission
RUN chown -R node:node ./log
RUN chmod 600 ./log

USER node
EXPOSE 3000
CMD [ "pnpm","start" ]

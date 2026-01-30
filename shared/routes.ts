import { z } from 'zod';
import { insertCandidateSchema, candidates, settings } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
};

export const api = {
  candidates: {
    list: {
      method: 'GET' as const,
      path: '/api/candidates',
      responses: {
        200: z.array(z.custom<typeof candidates.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/candidates',
      input: insertCandidateSchema,
      responses: {
        201: z.custom<typeof candidates.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    approve: {
      method: 'PATCH' as const,
      path: '/api/candidates/:id/approve',
      responses: {
        200: z.custom<typeof candidates.$inferSelect>(),
        403: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/candidates/:id',
      responses: {
        204: z.void(),
        403: errorSchemas.unauthorized,
      },
    },
  },
  votes: {
    submit: {
      method: 'POST' as const,
      path: '/api/votes',
      input: z.object({
        maleCandidateId: z.number(),
        femaleCandidateId: z.number(),
      }),
      responses: {
        200: z.object({ message: z.string() }),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    status: {
      method: 'GET' as const,
      path: '/api/votes/status',
      responses: {
        200: z.object({ hasVoted: z.boolean() }),
      },
    },
  },
  settings: {
    getPhase: {
      method: 'GET' as const,
      path: '/api/settings/phase',
      responses: {
        200: z.object({ phase: z.enum(['registration', 'voting', 'results']) }),
      },
    },
    setPhase: {
      method: 'POST' as const,
      path: '/api/settings/phase',
      input: z.object({ phase: z.enum(['registration', 'voting', 'results']) }),
      responses: {
        200: z.object({ phase: z.string() }),
        403: errorSchemas.unauthorized,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

import { z } from 'zod';
import type { User, TokensPair } from './model';
import type { StateType } from './user/model.ts';

const loginResponseSchema = z
  .object({
    accessToken: z.string(),
    refreshToken: z.string()
  })
  .passthrough();

export function validateLoginResponse(data: unknown): TokensPair & Record<string, unknown> {
  return loginResponseSchema.parse(data) as TokensPair & Record<string, unknown>;
}

const registerResponseSchema = z.object({
  id: z.number(),
  email: z.string()
});

export function validateRegisterResponse(data: unknown): { id: number; email: string } {
  return registerResponseSchema.parse(data) as { id: number; email: string };
}

const refreshResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string()
});

export function validateRefreshResponse(data: unknown): TokensPair {
  return refreshResponseSchema.parse(data) as TokensPair;
}

export const userSchema = z.object({
  id: z.number(),
  email: z.string(),
  name: z.string(),
  location: z.string(),
  oxygen: z.number(),
  gold: z.number(),
  provision: z.number(),
  martian_dollars: z.number()
});

const userPartialSchema = userSchema.pick({
  location: true,
  oxygen: true,
  gold: true,
  provision: true,
  martian_dollars: true
});

export const moveActionSchema = z.object({
  actionId: z.string(),
  playerId: z.string(),
  progress: z.number(),
  currentLocation: z.string(),
  type: z.literal('move'),
  pathLength: z.number(),
  path: z.array(
    z.object({
      location: z.string(),
      distance: z.number()
    })
  ),
  wayProgress: z.number()
});

export const mineActionSchema = z.object({
  actionId: z.string(),
  playerId: z.string(),
  progress: z.number(),
  currentLocation: z.string(),
  type: z.literal('mine'),
  goldMined: z.number(),
  duration: z.number().optional()
});

export const stateSchema = z.union([moveActionSchema, mineActionSchema, z.null()]);

export function validateUser(data: unknown): User {
  return userSchema.parse(data) as User;
}

export function validateUserPartial(
  data: unknown
): Pick<User, 'location' | 'oxygen' | 'gold' | 'provision' | 'martian_dollars'> {
  return userPartialSchema.parse(data) as Pick<
    User,
    'location' | 'oxygen' | 'gold' | 'provision' | 'martian_dollars'
  >;
}

export const playerUpdateSchema = z.object({
  data: z.object({
    state: z.unknown(),
    data: userPartialSchema
  }),
  tick: z.number()
});

export type PlayerUpdate = {
  data: {
    state: StateType;
    data: Pick<User, 'location' | 'oxygen' | 'gold' | 'provision' | 'martian_dollars'>;
  };
  tick: number;
};

export function validatePlayerUpdate(data: unknown): PlayerUpdate {
  return playerUpdateSchema.parse(data) as PlayerUpdate;
}

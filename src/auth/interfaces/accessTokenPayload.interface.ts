import { UUID } from 'crypto';

export interface AccessTokenPayload {
  userId: UUID;
  email: string;
}

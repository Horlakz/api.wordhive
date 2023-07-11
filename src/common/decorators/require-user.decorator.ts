import { SetMetadata } from '@nestjs/common';

export const REQUIRESUSERKEY = 'requiresUser';
export const RequiresUser = (): any => SetMetadata(REQUIRESUSERKEY, true);

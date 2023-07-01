import { SetMetadata } from '@nestjs/common';

export const ISPUBLICKEY = 'isPublic';
export const Public = () => SetMetadata(ISPUBLICKEY, true);

import { SetMetadata } from '@nestjs/common';

export const SKIPVALIDATION = 'skipValidation';
export const SkipValidation = () => SetMetadata(SKIPVALIDATION, true);

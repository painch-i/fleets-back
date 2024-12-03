import {
  TRANSPORT_MODE,
  TRANSPORT_SUB_MODE,
} from '@/features/search/constants/mappings.transport';
import { Line } from '@/features/search/types/line.types';

export const LINE_MOCKED: Line = {
  id: '3c4ff50a-71a8-465e-bfb2-764998ee571d',
  externalId: 'C01739',
  name: 'J',
  mode: TRANSPORT_MODE.RAIL,
  subMode: TRANSPORT_SUB_MODE.SUBURBAN_RAILWAY,
  textColor: '000000',
  color: 'cec73d',
};

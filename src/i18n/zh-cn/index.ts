import { LangType } from '@/constants';

import workspace from './workspace';
import setting from './setting';
import user from './user';
import common from './common';

export default{
    lang: LangType.ZH_CH,
    ...workspace,
    ...user,
    ...setting,
    ...common
}
import { LangType } from "@/constants";
import { getLang } from "@/utils/localStorage";
import React, { Fragment } from 'react';

import zhCN from './zh-cn';
import enUS from './en-us';


const locale = {
    'en-us': enUS,
    'zh-cn': zhCN
};

export const currentLang : LangType = getLang() || LangType.ZH_CH;
export const isEn = currentLang === LangType.ZH_CH;

const langSet: Record<string, string> = locale[currentLang];

function i18n(key: keyof typeof zhCN, ...args: any[]) {
    let result = langSet[key];
    if (result === undefined) {
      return `[${key}]`;
    } else {
      args.forEach((arg, i) => {
        result = result.replace(new RegExp(`\\{${i + 1}\\}`, 'g'), arg);
      });
      if (args.length) {
        result = result.replace(/\{(.+?)\|(.+?)\}/g, (_, singular, plural) => {
          const n = args[0];
          return n == 1 ? singular : plural;
        });
      }
      return result;
    }
}
  
function i18nElement(key: keyof typeof zhCN, ...args: React.ReactNode[]) {
    const str = langSet[key];
    if (str === undefined) {
      return `[${key}]`;
    } else {
      const result: React.ReactNode[] = [];
      str.split(/(\{\d\})/).forEach((item, i) => {
        if (/^\{\d\}$/.test(item)) {
          result.push(
            <Fragment key={i}>
              {args[parseInt(item.substring(1, item.length - 1)) - 1]}
            </Fragment>,
          );
        } else {
          result.push(
            <Fragment key={i}>
              {item.replace(/\{(.+?)\|(.+?)\}/g, (_, singular, plural) => {
                const n = args[0];
                return n == 1 ? singular : plural;
              })}
            </Fragment>,
          );
        }
      });
      return result;
    }
}
  
export default i18n;
export { i18n, i18nElement };
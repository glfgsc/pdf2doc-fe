import { LangType,ThemeType,PrimaryColorType } from "@/constants";

export function getLang(){
    return (localStorage.getItem('lang') as LangType) || 'en-us';
}

export function setLang(lang: LangType){
    return localStorage.setItem('lang',lang);
}

export function getTheme(): ThemeType {
    const themeColor: any = localStorage.getItem('theme') as ThemeType;
    if (themeColor) {
      return themeColor;
    }
    localStorage.setItem('theme', ThemeType.Light);
    // 默认主题色
    return ThemeType.Light;
}
  
export function setTheme(theme: ThemeType) {
    return localStorage.setItem('theme', theme);
}
  
export function getPrimaryColor(): PrimaryColorType {
    const primaryColor = localStorage.getItem('primary-color') as PrimaryColorType;
    if (primaryColor) {
        return primaryColor;
    }
    localStorage.setItem('primary-color', PrimaryColorType.Golden_Purple);
    // 默认主题色
    return PrimaryColorType.Golden_Purple;
}
  
export function setPrimaryColor(primaryColor: PrimaryColorType) {
    return localStorage.setItem('primary-color', primaryColor);
}

export function setToken(token: string){
    return localStorage.setItem('token',token);
}

export function getToken(){
    return localStorage.getItem('token');
}

export function removeToken(){
    localStorage.removeItem('token');
}
  
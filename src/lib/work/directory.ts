import type { WorkProject } from "./projects";
export type DirectoryCategory = "all" | "brand" | "digital" | "production";
export const directoryCategories = [
  {id:"all",label:"ALL WORK"},
  {id:"brand",label:"BRAND"},
  {id:"digital",label:"DIGITAL"},
  {id:"production",label:"PRODUCTION"},
] as const satisfies readonly {id:DirectoryCategory;label:string}[];
export function directoryCategory(project:WorkProject):Exclude<DirectoryCategory,"all"> {
  switch(project.discipline){
    case "BRAND IDENTITY": return "brand";
    case "CONTENT & PRODUCTION": return "production";
    case "DIGITAL EXPERIENCE": case "DIGITAL MARKETING": return "digital";
  }
}
export function isDirectoryCategory(value:string|null):value is DirectoryCategory {
 return value==="all"||value==="brand"||value==="digital"||value==="production";
}
export const workVisuals={
 "mymo-express":{chapter:"CONNECTION / 01",accent:"#ee6433"},
 "casabella-oman":{chapter:"DESIGN / 02",accent:"#e85c74"},
 "best-genetco":{chapter:"CULTURE / 03",accent:"#527eac"},
 "aqua-petro":{chapter:"INDUSTRY / 04",accent:"#53bbcd"},
 "razmazaan":{chapter:"FLAVOUR / 05",accent:"#bc6748"},
 "vitamin-phones":{chapter:"SYSTEMS / 06",accent:"#a87ac8"},
} as const;

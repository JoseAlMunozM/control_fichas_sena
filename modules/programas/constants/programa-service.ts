export const PROGRAMA_SERVICE_MESSAGES = {
  duplicateCode:
    "Ya existe un programa con ese código. Busca el programa existente para editarlo o utiliza un código diferente.",
  duplicatePlanVersion:
    "Ya existe una versión con ese nombre dentro del programa. Edita la versión existente o utiliza otro nombre.",
  duplicateCompetency:
    "La competencia ya está incluida en este plan con el mismo nombre o la misma norma. Edita la existente en lugar de duplicarla.",
  planNotFound: "El plan de formación solicitado no existe.",
  competencyNotFound:
    "La competencia solicitada no existe en el plan.",
  notFound: "El programa solicitado no existe.",
} as const;

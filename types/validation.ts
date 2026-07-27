export type ValidationErrors<Field extends string = string> = Partial<
  Record<Field, string>
>;

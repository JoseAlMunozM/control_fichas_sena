export type SelectOptionValue = string | number;

export interface SelectOption<
  Value extends SelectOptionValue = SelectOptionValue,
> {
  label: string;
  value: Value;
  disabled?: boolean;
}

export enum InputType {
  Number = 'number',
  String = 'string',
}

export type InputNodeData = {
  variable: string;
  type?: InputType;
};

export enum InputType {
  Number = 'number',
  String = 'string',
}

export type InputNodeData = {
  name: string;
  type: `${InputType}`;
};

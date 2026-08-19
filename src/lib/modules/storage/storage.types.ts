export interface StorageInterface extends Pick<
  Storage,
  'getItem' | 'setItem' | 'removeItem'
> {}

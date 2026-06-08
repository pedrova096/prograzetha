export enum DrawerRoutes {
  Home = '/',
  Root = '/drawer',
  NodeTypeId = '/drawer/node/:type/:id',
  Node = '/drawer/node',
  Code = '/drawer/code',
  Execution = '/drawer/execution',
}

export enum NodeRoutes {
  WildCard = '/drawer/node/*',
  InputId = '/drawer/node/input/:id',
  ConditionId = '/drawer/node/condition/:id',
  OperationId = '/drawer/node/operation/:id',
  OutputId = '/drawer/node/output/:id',
}

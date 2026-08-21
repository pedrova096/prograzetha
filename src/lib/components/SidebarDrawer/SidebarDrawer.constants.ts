export enum DrawerRoutes {
  Home = '/',
  Root = '/drawer',
  NodeTypeId = '/drawer/node/:type/:id',
  Node = '/drawer/node',
  Code = '/drawer/code',
  Execution = '/drawer/execution',
  Storage = '/drawer/storage',
}

export enum NodeRoutes {
  WildCard = '/drawer/node/*',
  InputId = '/drawer/node/input/:id',
  ConditionId = '/drawer/node/condition/:id',
  WhileLoopId = '/drawer/node/while-loop/:id',
  ForLoopId = '/drawer/node/for-loop/:id',
  OperationId = '/drawer/node/operation/:id',
  OutputId = '/drawer/node/output/:id',
}

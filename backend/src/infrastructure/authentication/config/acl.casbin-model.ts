import { Model } from 'casbin';

export const aclCasbinModel = new Model();
aclCasbinModel.addDef('r', 'r', 'sub, obj, act');
aclCasbinModel.addDef('p', 'p', 'sub, obj, act');
aclCasbinModel.addDef('e', 'e', 'some(where (p.eft == allow))');

// Les sujets, objets et actions doivent correspondre, et si l'action est "read" et la règle de politique a l'action "write", l'accès est autorisé.
aclCasbinModel.addDef(
  'm',
  'm',
  'r.sub == p.sub && r.obj == p.obj && (r.act == p.act || r.act == "read" && p.act == "write")',
);

import fs from 'fs-extra';
import { execSync } from 'child_process';

export function asyncToSync(
  asyncPath: string,
  jsonInterfacePath: string,
  postprocess: (payload: any) => any = f => f
) {
  execSync(`node ${asyncPath} ${jsonInterfacePath}`);
  const payload = fs.readJsonSync(jsonInterfacePath);
  fs.unlinkSync(jsonInterfacePath);
  return postprocess(payload);
}

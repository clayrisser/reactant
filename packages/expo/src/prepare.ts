import fs from 'fs-extra';
import modInline from 'mod-inline';
import path from 'path';

const GET_FILE_HASH = / {4}if \(!sha1\) {\n {6}return getFileHash\(resolvedPath\);/;
const GET_SHA1_FUNC = / {2}getSha1\(filename\) {((\n {4}.*|\n)+)+ {2}}/;
const IF_SHA1 = / {4}if \(!sha1\) {/;

(async () => {
  const dependencyGraphPath = path.resolve(
    __dirname,
    '../node_modules/metro/src/node-haste/DependencyGraph.js'
  );
  const content = (await fs.readFile(dependencyGraphPath)).toString();
  const patched = !!modInline.isolate(
    modInline.isolate(content, GET_SHA1_FUNC),
    GET_FILE_HASH
  );
  if (patched) return;
  const patchedContent = modInline.append(
    content,
    [GET_SHA1_FUNC, IF_SHA1],
    `
      return getFileHash(resolvedPath);
      function getFileHash(file) {
        return require('crypto')
          .createHash('sha1')
          .update(fs.readFileSync(file))
          .digest('hex');
      }`
  );
  await fs.writeFile(dependencyGraphPath, patchedContent);
})();

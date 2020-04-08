/*
  ├── package.json
  ├── public
  │   ├── favicon.ico
  │   ├── index.html
  │   ├── logo192.png
  │   ├── logo512.png
  │   ├── manifest.json
  │   └── robots.txt
  ├── README.md
  ├── src
  │   ├── App.css
  │   ├── App.test.tsx
  │   ├── App.tsx
  │   ├── index.css
  │   ├── index.tsx
  │   ├── logo.svg
  │   ├── react-app-env.d.ts
  │   ├── serviceWorker.ts
  │   └── setupTests.ts
  ├── tsconfig.json
  */

export default async function writing(yo) {
  if (yo.context.platform.includes('web')) {
    yo.fs.copy(
      yo.templatePath('template/web/public'),
      yo.destinationPath('public')
    );
    yo.fs.copy(
      yo.templatePath('template/shared/web'),
      yo.destinationPath('web')
    );
    yo.fs.copy(
      yo.templatePath('template/web/src/serviceWorker.ts'),
      yo.destinationPath('web/serviceWorker.ts')
    );
    yo.fs.copy(
      yo.templatePath('template/web/package.json'),
      yo.destinationPath('web/package.json')
    );
  }

  yo.fs.copyTpl(
    yo.templatePath('template/shared/src/**'),
    yo.destinationPath('src'),
    yo.context
  );
  if (!yo.context.lock) {
    yo.fs.copy(
      yo.templatePath('template/shared/_npmrc'),
      yo.destinationPath('.npmrc')
    );
  }
  yo.fs.copyTpl(
    yo.templatePath('template/shared/_reactantrc'),
    yo.destinationPath('.reactantrc'),
    yo.context
  );
  yo.fs.copy(
    yo.templatePath('template/shared/_eslintrc'),
    yo.destinationPath('.eslintrc')
  );
  yo.fs.copy(
    yo.templatePath('template/shared/_dockerignore'),
    yo.destinationPath('.dockerignore')
  );
  yo.fs.copy(
    yo.templatePath('template/shared/Makefile'),
    yo.destinationPath('Makefile')
  );
  yo.fs.copy(
    yo.templatePath('template/shared/prepare.sh'),
    yo.destinationPath('prepare.sh')
  );
  yo.fs.copy(
    yo.templatePath('template/shared/_babelrc'),
    yo.destinationPath('.babelrc')
  );
  yo.fs.copy(
    yo.templatePath('template/shared/_cspellrc'),
    yo.destinationPath('.cspellrc')
  );
  yo.fs.copyTpl(
    yo.templatePath('template/shared/_gitignore'),
    yo.destinationPath('.gitignore'),
    yo.context
  );
  yo.fs.copyTpl(
    yo.templatePath('template/shared/_package.json'),
    yo.destinationPath('package.json'),
    yo.context
  );
  yo.fs.copy(
    yo.templatePath('template/shared/_prettierrc'),
    yo.destinationPath('.prettierrc')
  );
  yo.fs.copy(
    yo.templatePath('template/shared/tsconfig.json'),
    yo.destinationPath('tsconfig.json')
  );
  yo.fs.copyTpl(
    yo.templatePath('template/shared/tests'),
    yo.destinationPath('tests'),
    yo.context
  );
  yo.fs.copy(
    yo.templatePath('template/shared/tests/_eslintrc'),
    yo.destinationPath('tests/.eslintrc')
  );
}

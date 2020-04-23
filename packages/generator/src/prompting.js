import YoBasePrompts from 'yo-base-prompts';
import pkg from '../../package.json';

export default async function prompting(yo) {
  const yoBasePrompts = new YoBasePrompts(yo);
  const {
    authorEmail,
    authorName,
    authorUrl,
    description,
    destination,
    githubUsername,
    homepage,
    license,
    name,
    repository,
    version
  } = await yoBasePrompts.prompt({
    authorEmail: true,
    authorName: true,
    authorUrl: true,
    description: true,
    destination: true,
    githubUsername: true,
    homepage: true,
    license: true,
    name: true,
    repository: true,
    version: true
  });
  const { platforms, plugins } = await yo.optionOrPrompt([
    {
      type: 'checkbox',
      name: 'platforms',
      message: 'Platforms:',
      default: [],
      choices: [
        { name: 'web', value: 'web' },
        { name: 'expo', value: 'expo' }
      ]
    },
    {
      type: 'checkbox',
      name: 'plugins',
      message: 'Plugins:',
      default: ['storybook'],
      choices: [
        { name: 'redux', value: 'redux' },
        { name: 'storybook', value: 'storybook' }
      ]
    }
  ]);
  const keywords = [name];
  for (;;) {
    const { keyword } = await yo.prompt([
      {
        type: 'input',
        name: 'keyword',
        message: 'Keyword:'
      }
    ]);
    if (keyword === '') break;
    keywords.push(keyword);
  }
  const { install, lock } = await yo.optionOrPrompt([
    {
      type: 'confirm',
      name: 'lock',
      message: 'Support package-lock.json',
      default: false
    },
    {
      type: 'confirm',
      name: 'install',
      message: 'Install dependencies',
      default: true
    }
  ]);
  yo.answers = {
    authorEmail,
    authorName,
    authorUrl,
    description,
    destination,
    githubUsername,
    homepage,
    install,
    keywords,
    license,
    lock,
    name,
    platforms,
    plugins,
    reactantVersion: pkg.version,
    repository,
    version
  };
  if (
    (
      await yo.optionOrPrompt([
        {
          type: 'confirm',
          name: 'generatorGithubProject',
          message: 'Generator GitHub Project:',
          default: true
        }
      ])
    ).generatorGithubProject
  ) {
    yo.composeWith(require.resolve('generator-github-project'), {
      ...yo.answers,
      template: 'minimal'
    });
  }
  yo.context = { ...yo.context, ...yo.answers };
}

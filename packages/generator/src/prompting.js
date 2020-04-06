import YoBasePrompts from 'yo-base-prompts';

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
  const { install, bin, lock } = await yo.optionOrPrompt([
    {
      type: 'confirm',
      name: 'bin',
      message: 'Project is a bin',
      default: false
    },
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
    bin,
    lock,
    description,
    destination,
    githubUsername,
    homepage,
    install,
    keywords,
    license,
    name,
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

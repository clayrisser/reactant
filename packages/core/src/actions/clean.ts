export default async function clean(
  platform: string,
  options: Options = {}
): Promise<Context> {
  const context = await bootstrap(platform, options);
  return context;
}
export default function hotModule() {
  if (module.hot) {
    module.hot.accept('~/App', () => {
      console.log("HMR reloading 'server.js' . . .");
    });
    console.log('server HMR enabled');
  }
}

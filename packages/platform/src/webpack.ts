// import { Configuration, Rule } from 'webpack';

// export async function createWebpackConfig(webpack: Configuration) {
//   const babelRule = webpack.module.rules.find((rule: Rule) => {
//     if (Array.isArray(rule.use)) {
//       return rule.use.includes('babel-plugin');
//     } else if (typeof rule.use === 'string') {
//       return rule.use === 'babel-plugin';
//     } else if (rule.use.loader) {
//       return rule.use.loader === 'babel-plugin';
//     }
//     return false;
//   });

//   return webpack;
// }

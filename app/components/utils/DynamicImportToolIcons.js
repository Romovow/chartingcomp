// DynamicImportAllIcons.js
const allIcons = {};

// Dynamically import each SVG icon
const importAll = (r) => r.keys().map(r);

importAll(require.context('./icons', false, /\.svg$/)).forEach((module) => {
  const iconName = module.default.name.replace('.svg', '');
  allIcons[iconName] = module.default;
});

export default allIcons;

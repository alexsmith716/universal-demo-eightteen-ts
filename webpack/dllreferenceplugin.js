const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const projectRootPath = path.resolve(__dirname, '../');

// The DllPlugin and DllReferencePlugin provide means to
//   split bundles in a way that can drastically improve build time performance
// DllPlugin moves code that is changed less often into a separate compilation

// >>>> Improves App's Compilation Speed <<<<

// https://webpack.js.org/guides/build-performance/#dlls
// https://webpack.js.org/plugins/dll-plugin

// ---------------------------------

function loadDLLManifest(filePath) {
  try {
    // console.log('>>>> dllreferenceplugin > loadDLLManifest > GOOD <<<<');
    // eslint-disable-next-line global-require, import/no-dynamic-require
    return require(filePath);
  } catch (e) {
    process.env.WEBPACK_DLLS = '0';
    // console.log('>>>> dllreferenceplugin > loadDLLManifest > Error: ', e);
  }
  // console.log('>>>> dllreferenceplugin > loadDLLManifest > Undefined <<<<');
  return undefined;
}

// ---------------------------------

function installVendorDLLX(config, dllName) {
  const manifestX = loadDLLManifest(path.join(projectRootPath, `webpack/dlls/${dllName}.json`));
  // reference the dll-only-bundle to require pre-built dependencies
  // https://webpack.js.org/plugins/dll-plugin/#dllreferenceplugin
  // https://webpack.js.org/plugins/dll-plugin/#mapped-mode
  // The content of the dll is mapped to the current directory
  // If a required file matches a file in the dll, then the file from the dll is used instead
  // context: context of requests in the manifest (or content property)
  // manifest: path of the JSON manifest to be loaded upon compilation
  if (manifestX) {
    // console.log(`>>>> dllreferenceplugin > installVendorDLL: will be using the ${dllName} DLL`);
    config.plugins.push(new webpack.DllReferencePlugin({
      context: projectRootPath,
      manifest: manifestX,
    }));
  } else {
    // console.log('>>>> dllreferenceplugin > installVendorDLL > No Manifest <<<<');
  }
}

// ---------------------------------

function isValidDLLsX(dllNames, assetsPath) {
  return (Array.isArray(dllNames) ? dllNames : [dllNames]).every(dllName => {
    try {
      // eslint-disable-next-line global-require, import/no-dynamic-require
      const manifest = require(path.join(projectRootPath, `webpack/dlls/${dllName}.json`));
      const dll = fs.readFileSync(path.join(assetsPath, `dlls/dll__${dllName}.js`), 'utf8');

      if (dll.indexOf(manifest.name) === -1) {
        // console.warn(`>>>> dllreferenceplugin > isValidDLLs > Invalid: ${dllName}`);
        return false;
      }
    } catch (e) {
      // console.warn('>>>> dllreferenceplugin > isValidDLLs > Error: ', e);
      return false;
    }
    // console.log('>>>> dllreferenceplugin > isValidDLLs > Valid <<<<');
    return true;
  });
}

// ---------------------------------

module.exports = {
  isValidDLLs: isValidDLLsX,
  installVendorDLL: installVendorDLLX,
};

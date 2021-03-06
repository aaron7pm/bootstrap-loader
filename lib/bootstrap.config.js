'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loglevel = exports.bootstrapVersion = undefined;
exports.createConfig = createConfig;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fileExists = require('./utils/fileExists');

var _fileExists2 = _interopRequireDefault(_fileExists);

var _resolveDefaultConfigPath = require('./utils/resolveDefaultConfigPath');

var _resolveDefaultConfigPath2 = _interopRequireDefault(_resolveDefaultConfigPath);

var _parseConfig = require('./utils/parseConfig');

var _parseConfig2 = _interopRequireDefault(_parseConfig);

var _selectModules = require('./utils/selectModules');

var _selectModules2 = _interopRequireDefault(_selectModules);

var _selectUserModules = require('./utils/selectUserModules');

var _selectUserModules2 = _interopRequireDefault(_selectUserModules);

var _getEnvProp = require('./utils/getEnvProp');

var _getEnvProp2 = _interopRequireDefault(_getEnvProp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* ======= Fetching config */

var DEFAULT_VERSION = 3;
var SUPPORTED_VERSIONS = [3, 4];
var CONFIG_FILE = '.bootstraprc';

var userConfigPath = _path2.default.resolve(__dirname, '../../../' + CONFIG_FILE);
var isUserConfig = (0, _fileExists2.default)(userConfigPath);

var rawConfig = undefined;
var defaultConfig = undefined;

if (isUserConfig) {
  rawConfig = (0, _parseConfig2.default)(userConfigPath);

  var _rawConfig = rawConfig;
  var _bootstrapVersion = _rawConfig.bootstrapVersion;

  if (!_bootstrapVersion) {
    throw new Error('\n      I can\'t find Bootstrap version in your \'.bootstraprc\'.\n      Make sure it\'s set to 3 or 4. Like this:\n        bootstrapVersion: 4\n    ');
  }

  if (SUPPORTED_VERSIONS.indexOf(parseInt(_bootstrapVersion, 10)) === -1) {
    throw new Error('\n      Looks like you have unsupported Bootstrap version in your \'.bootstraprc\'.\n      Make sure it\'s set to 3 or 4. Like this:\n        bootstrapVersion: 4\n    ');
  }

  var defaultConfigPath = (0, _resolveDefaultConfigPath2.default)(CONFIG_FILE, _bootstrapVersion);
  defaultConfig = (0, _parseConfig2.default)(defaultConfigPath);
} else {
  var defaultConfigPath = (0, _resolveDefaultConfigPath2.default)(CONFIG_FILE, DEFAULT_VERSION);
  rawConfig = defaultConfig = (0, _parseConfig2.default)(defaultConfigPath);
}

/* ======= Exports */

var bootstrapVersion = exports.bootstrapVersion = parseInt(rawConfig.bootstrapVersion, 10);
var loglevel = exports.loglevel = rawConfig.loglevel;

function createConfig(_ref) {
  var bootstrapPath = _ref.bootstrapPath;
  var bootstrapRelPath = _ref.bootstrapRelPath;
  var extractStyles = _ref.extractStyles;

  if (isUserConfig) {
    return {
      bootstrapPath: bootstrapPath,
      bootstrapRelPath: bootstrapRelPath,
      bootstrapVersion: bootstrapVersion,
      loglevel: loglevel,
      useFlexbox: rawConfig.useFlexbox,
      preBootstrapCustomizations: rawConfig.preBootstrapCustomizations,
      bootstrapCustomizations: rawConfig.bootstrapCustomizations,
      appStyles: rawConfig.appStyles,
      extractStyles: extractStyles || (0, _getEnvProp2.default)('extractStyles', rawConfig),
      styleLoaders: rawConfig.styleLoaders,
      styles: (0, _selectUserModules2.default)(rawConfig.styles, defaultConfig.styles),
      scripts: (0, _selectUserModules2.default)(rawConfig.scripts, defaultConfig.scripts)
    };
  }

  return {
    bootstrapPath: bootstrapPath,
    bootstrapRelPath: bootstrapRelPath,
    bootstrapVersion: bootstrapVersion,
    loglevel: loglevel,
    useFlexbox: defaultConfig.useFlexbox,
    extractStyles: extractStyles || (0, _getEnvProp2.default)('extractStyles', defaultConfig),
    styleLoaders: defaultConfig.styleLoaders,
    styles: (0, _selectModules2.default)(defaultConfig.styles),
    scripts: (0, _selectModules2.default)(defaultConfig.scripts)
  };
}
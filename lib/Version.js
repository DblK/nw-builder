var platforms   = require('./platforms');
var _           = require('lodash');
var semver      = require('semver');

/**
 * Represents a version.
 * @constructor
 * @param {string} args.version.
 * @param {array} args.supportedPlatforms - array of strings like `osx64`.
 * @param {string} args.downloadUrl.
 */
module.exports = function Version(args){
    var generatePlatformUrls,
        result = {
            isLegacy: semver.satisfies(args.version, '<0.12.3'),
            name: semver.satisfies(args.version, '>=0.12.0 || ~0.12.0-alpha') ? 'nwjs' : 'node-webkit',
            version: args.version
        };

    if(result.isLegacy){
        generatePlatformUrls = function(version, supportedPlatforms){
            var platformUrls = {};
            supportedPlatforms.forEach(function (supportedPlatform) {
                platformUrls[supportedPlatform] = args.downloadUrl + _.template(platforms[supportedPlatform].versionNameTemplate, result);
            });
            return platformUrls;
        };
    }
    else {
        var fixPlatformName = function(platform){
            return platform.replace('32', '-ia32').replace('64', '-x64');
        };

        var mapPlatformToExtension = function(platform){
            if(platform.indexOf('linux') === 0){
                return 'tar.gz'
            }

            return 'zip'
        };

        generatePlatformUrls = function(version, supportedPlatforms){
            var platformUrls = {};
            supportedPlatforms.forEach(function(platform){
                platformUrls[platform] = args.downloadUrl + 'v' + version + '/nwjs-sdk-v' + version + '-' + fixPlatformName(platform)
                    + '.' + mapPlatformToExtension(platform);
            });
            return platformUrls;
        };
    }

    result.platforms = generatePlatformUrls(args.version, args.supportedPlatforms);
    return result;
};
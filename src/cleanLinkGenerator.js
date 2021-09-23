const queryString = require('query-string');

const linkTag = {
  amazon: 'promospider-20'
};

function cleanLinkGenerator(dirtyLink) {
  const parsedUrlAndParams = queryString.parseUrl(dirtyLink);

  const { url, query } = parsedUrlAndParams;

  if(url.includes('amazon')){
    parsedUrlAndParams.query.tag = linkTag.amazon;
    const cleanLink = queryString.stringifyUrl(parsedUrlAndParams);

    console.log("🔗 Amazon link cleaned!")
    return cleanLink
  }

  console.log('🚯 The link wasn`t clean.')
  return dirtyLink
}

module.exports = cleanLinkGenerator
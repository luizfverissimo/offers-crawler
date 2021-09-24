const queryString = require('query-string');

const linkTag = {
  amazon: 'promospider-20',
  magalu: 'magazinepromospider'
};

function cleanLinkGenerator(dirtyLink) {
  if(dirtyLink.includes('magazine')) {
    const cleanLink = dirtyLink.replace('magazineofertaesperta', linkTag.magalu)    
    console.log("🔗 Magalu link cleaned!")
    return cleanLink
  }

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
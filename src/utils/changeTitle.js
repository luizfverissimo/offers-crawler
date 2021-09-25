function changeTitle(title) {
  if(title.includes('Ofertaesperta')) {
    return title.replace('Ofertaesperta', 'Promospider')
  }
  return title
}

module.exports = changeTitle
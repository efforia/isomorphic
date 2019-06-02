const negative = [
  { label: 'Ansiedade' },
  { label: 'Arrependimento' },
  { label: 'Ciúme ' },
  { label: 'Culpa' },
  { label: 'Depressão' },
  { label: 'Frustração' },
  { label: 'Indignação ' },
  { label: 'Inveja' },
  { label: 'Mágoa' },
  { label: 'Medo' },
  { label: 'Preguiça' },
  { label: 'Preocupação' },
  { label: 'Raiva' },
  { label: 'Solidão' },
  { label: 'Vergonha' }
]

const formatItems = items =>
  /* eslint-disable-next-line */
  items.map(item => {
    return {
      ...item,
      value: item.label
        .toLowerCase()
        .replace(/ /g, '_')
        .replace(/á/g, 'a')
        .replace(/ã/g, 'a')
        .replace(/â/g, 'a')
        .replace(/ó/g, 'o')
        .replace(/õ/g, 'o')
        .replace(/ô/g, 'o')
        .replace(/é/g, 'e')
        .replace(/ê/g, 'e')
        .replace(/ú/g, 'u')
        .replace(/\//g, '_')
    }
  })

export default {
  negative: formatItems(negative)
}

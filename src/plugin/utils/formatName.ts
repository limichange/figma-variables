export function formatName(name: string) {
  const newName = name
    .toLocaleLowerCase()
    .replace(/\,/g, '')
    .replace(/(\․|\ \()|(\)\ )|(\)\/)|\(|\)| |\//g, '-');

  // remove last -
  if (newName.endsWith('-')) {
    return newName.slice(0, -1);
  } else {
    return newName;
  }
}

export function getLastName(name: string) {
  const onlyAliasLastNames = name.split('/');

  if (onlyAliasLastNames.length > 1) {
    return onlyAliasLastNames[onlyAliasLastNames.length - 1];
  } else {
    return name;
  }
}

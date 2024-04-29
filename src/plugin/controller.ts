import colorConverter from 'color-convert';

figma.showUI(__html__);

figma.ui.onmessage = () => {
  const localVariableCollections = figma.variables.getLocalVariableCollections();
  const values: Record<string, Record<string, string | number>> = {};

  for (const localVariableCollection of localVariableCollections) {
    const { modes, name: localVariableCollectionName, variableIds, defaultModeId } = localVariableCollection;

    console.log(localVariableCollectionName, modes);

    if (
      localVariableCollectionName === '_Primitives' ||
      localVariableCollectionName === '1. Color modes' ||
      localVariableCollectionName === '2. Radius' ||
      localVariableCollectionName === '3. Spacing' ||
      localVariableCollectionName === '4. Widths' ||
      localVariableCollectionName === '5. Containers'
    ) {
      values[localVariableCollectionName] = {};

      variableIds.forEach((variableId) => {
        const variable = figma.variables.getVariableById(variableId);

        // console.log(variable);

        if (variable.resolvedType === 'COLOR') {
          const color = variable.valuesByMode[defaultModeId];
          let colorValue = '';

          if (typeof color === 'object' && color['a'] === 0) {
            colorValue = 'transparent';
          } else if (color['a'] === 1) {
            const colorRGB = color as RGB;

            colorValue = '#' + colorConverter.rgb.hex(colorRGB.r * 100, colorRGB.g * 100, colorRGB.b * 100);
          } else if (color['a'] !== 1 && typeof color['a'] === 'number') {
            const colorRGBA = color as RGBA;
            colorValue = `rgba(${colorRGBA.r}, ${colorRGBA.g}, ${colorRGBA.b}, ${colorRGBA.a.toFixed(2)})`;
          } else if (color['type'] === 'VARIABLE_ALIAS') {
            const colorAlias = color as VariableAlias;
            const variableAlias = figma.variables.getVariableById(colorAlias.id);

            colorValue = variableAlias.name.toLocaleLowerCase().replace(/(\ \()|(\)\ )|(\)\/)|\(|\)| |\//g, '-');
          } else {
            console.log('!!!size', color);
          }

          const keyName = variable.name.toLocaleLowerCase().replace(/(\ \()|(\)\ )|(\)\/)|\(|\)| |\//g, '-');

          values[localVariableCollectionName][keyName] = colorValue;
        } else if (variable.resolvedType === 'FLOAT') {
          const size = variable.valuesByMode[defaultModeId] as number | VariableAlias;

          if (typeof size === 'number') {
            values[localVariableCollectionName][variable.name] = size;
          } else if (size.type === 'VARIABLE_ALIAS') {
            size as VariableAlias;

            const variable = figma.variables.getVariableById(size.id);

            values[localVariableCollectionName][variable.name] = variable.name;
          } else {
            console.log('!!!size', size);
          }
        } else {
          console.log('!!!variable', variable);
        }
      });
    }
  }

  console.log(values);

  // figma.variables.getLocalVariablesAsync().then((variables) => {
  //   console.log(variables);

  //   for (const variable of variables) {
  //     if (variable.resolvedType === 'COLOR') {
  //       console.log(variable);
  //     }

  //     // color
  //     // if (variable.valuesByMode['5248:3']) {
  //     //   console.log(variable, variable.name, variable.valuesByMode['5248:3']);
  //     // } else {
  //     //   // console.log(variable.resolvedType, variable.name, variable.valuesByMode);
  //     // }
  //   }

  //   figma.ui.postMessage({
  //     type: 'return-local-variables',
  //     message: '2',
  //   });
  // });
};

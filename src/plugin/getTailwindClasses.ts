import { formatName } from './utils/formatName';
import { getLastName } from './utils/getLastName';

const borderRadiusMap = new Map<number, string>();

borderRadiusMap.set(0, 'none');
borderRadiusMap.set(2, 'xxs');
borderRadiusMap.set(4, 'xs');
borderRadiusMap.set(6, 'sm');
borderRadiusMap.set(8, 'md');
borderRadiusMap.set(10, 'lg');
borderRadiusMap.set(12, 'xl');
borderRadiusMap.set(16, '2xl');
borderRadiusMap.set(20, '3xl');
borderRadiusMap.set(24, '4xl');
borderRadiusMap.set(9999, 'full');

export default function getTailwindClasses(node: SceneNode) {
  const tailwindClasses: string[] = [];

  console.log(node);

  if (node.type === 'TEXT') {
    const textNode = node as TextNode;

    const id = textNode.fills[0].boundVariables.color.id;
    const variable = figma.variables.getVariableById(id);
    const textColorClass = `text-${formatName(getLastName(variable.name))}`;
    tailwindClasses.push(textColorClass);

    const textStyleId = textNode.textStyleId;

    if (textStyleId) {
      const textStyle = figma.getStyleById(textStyleId as string);

      const name = textStyle.name;
      const names = name.split('/');

      const fontSize = names[0].replace(' ', '-').toLowerCase();
      if (fontSize.startsWith('display-')) {
        tailwindClasses.push(`text-${fontSize}`);
      } else {
        tailwindClasses.push(fontSize);
      }

      const fontWeight = names[1].toLowerCase();
      const fontWeightClass = `font-${fontWeight}`;
      if (fontWeight !== 'regular') {
        tailwindClasses.push(fontWeightClass);
      }
    }

    if (textNode.opacity < 1) {
      tailwindClasses.push(`opacity-${textNode.opacity.toFixed(2)}`);
    }
  } else if (
    node.type === 'FRAME' ||
    node.type === 'GROUP' ||
    node.type === 'INSTANCE' ||
    node.type === 'LINE' ||
    node.type === 'COMPONENT'
  ) {
    const frameNode = node as FrameNode;

    try {
      const id = frameNode.fills[0].boundVariables.color.id;
      const variable = figma.variables.getVariableById(id);
      const bgToken = formatName(getLastName(variable.name));
      const textColorClass = bgToken.startsWith('bg-') ? bgToken : `bg-${bgToken}`;

      tailwindClasses.push(textColorClass);
    } catch (error) {
      console.log(error);
    }

    // paddingBottom : 16
    // paddingLeft : 16
    // paddingRight : 16
    // paddingTop : 16
    const { paddingBottom, paddingLeft, paddingRight, paddingTop } = frameNode;

    function addPadding(value: number, str: string) {
      if (value && typeof value === 'number' && value > 0) {
        tailwindClasses.push(str);
      }
    }

    if (paddingTop === paddingBottom && paddingLeft === paddingRight && paddingTop === paddingRight) {
      addPadding(paddingTop, `p-${paddingTop}`);
    } else {
      if (paddingTop === paddingBottom) {
        addPadding(paddingTop, `py-${paddingTop}`);
      } else {
        if (paddingBottom) {
          addPadding(paddingBottom, `pb-${paddingBottom}`);
        }
        if (paddingTop) {
          addPadding(paddingTop, `pt-${paddingTop}`);
        }
      }

      if (paddingLeft === paddingRight) {
        addPadding(paddingLeft, `px-${paddingLeft}`);
      } else {
        if (paddingLeft) {
          addPadding(paddingLeft, `pl-${paddingLeft}`);
        }
        if (paddingRight) {
          addPadding(paddingRight, `pr-${paddingRight}`);
        }
      }
    }

    const { cornerRadius } = frameNode;

    if (cornerRadius && typeof cornerRadius === 'number') {
      tailwindClasses.push(`rounded-${borderRadiusMap.get(cornerRadius)}`);
    }

    if (frameNode.layoutMode !== 'NONE') {
      const { counterAxisAlignItems, primaryAxisAlignItems } = frameNode;

      if (frameNode.layoutMode === 'HORIZONTAL') {
        tailwindClasses.push('flex');

        if (counterAxisAlignItems === 'CENTER') {
          tailwindClasses.push('items-center');
        } else if (counterAxisAlignItems === 'MAX') {
          tailwindClasses.push('items-end');
        }

        if (primaryAxisAlignItems === 'CENTER') {
          tailwindClasses.push('justify-center');
        } else if (primaryAxisAlignItems === 'MAX') {
          tailwindClasses.push('justify-end');
        } else if (primaryAxisAlignItems === 'SPACE_BETWEEN') {
          tailwindClasses.push('justify-between');
        }
      } else if (frameNode.layoutMode === 'VERTICAL') {
        tailwindClasses.push('flex flex-col');

        if (counterAxisAlignItems === 'CENTER') {
          tailwindClasses.push('items-center');
        } else if (counterAxisAlignItems === 'MAX') {
          tailwindClasses.push('items-end');
        }

        if (primaryAxisAlignItems === 'CENTER') {
          tailwindClasses.push('justify-center');
        } else if (primaryAxisAlignItems === 'MAX') {
          tailwindClasses.push('justify-end');
        } else if (primaryAxisAlignItems === 'SPACE_BETWEEN') {
          tailwindClasses.push('justify-between');
        }
      }
    }

    if (frameNode.itemSpacing) {
      tailwindClasses.push(`gap-${frameNode.itemSpacing}`);
    }

    if (frameNode.opacity < 1) {
      tailwindClasses.push(`opacity-${frameNode.opacity.toFixed(2)}`);
    }

    // strokes
    const { strokeWeight, strokes } = frameNode;

    if (strokeWeight && typeof strokeWeight === 'number' && strokeWeight > 0 && strokes && strokes.length > 0) {
      if (strokeWeight === 1) {
        tailwindClasses.push('border');
      } else {
        tailwindClasses.push(`border-${strokeWeight}`);
      }

      const strokeColor = strokes[0] as any;
      const id = strokeColor.boundVariables.color.id;
      const variable = figma.variables.getVariableById(id);
      const strokeColorClass = `border-${formatName(getLastName(variable.name))}`;
      tailwindClasses.push(strokeColorClass);
    }
  }

  console.log(tailwindClasses);

  return tailwindClasses;

  // if (node.type === 'FRAME') {
  //   const frame = node as FrameNode;

  //   if (frame.layoutMode === 'HORIZONTAL') {
  //     tailwindClasses.push('flex');
  //   } else if (frame.layoutMode === 'VERTICAL') {
  //     tailwindClasses.push('flex-col');
  //   }
  // } else if (node.type === 'VECTOR') {
  //   const vector = node as VectorNode;

  //   if (vector.vectorNetwork.vertices.length === 2) {
  //     tailwindClasses.push('h-full');
  //   } else if (vector.vectorNetwork.vertices.length === 3) {
  //     tailwindClasses.push('w-full');
  //   }
  // }
}

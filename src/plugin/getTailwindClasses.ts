import { formatName } from './utils/formatName';
import { getLastName } from './utils/getLastName';

export default function getTailwindClasses(node: SceneNode) {
  const tailwindClasses: string[] = [];

  if (node.type === 'TEXT') {
    const textNode = node as TextNode;

    const id = textNode.fills[0].boundVariables.color.id;
    const variable = figma.variables.getVariableById(id);

    const textColorClass = `text-${formatName(getLastName(variable.name))}`;

    console.log(textColorClass);
  }

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

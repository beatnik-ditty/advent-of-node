import { Tree, formatFiles, generateFiles, joinPathFragments, readProjectConfiguration } from '@nx/devkit';

import { SolverGeneratorSchema } from './schema';

export const solverGenerator = async (tree: Tree, options: SolverGeneratorSchema) => {
  const currentYear = new Date().getFullYear();
  if (options.year < 2015 || options.year > new Date().getFullYear()) {
    throw new Error(`Invalid option: the year should be between 2015 and ${currentYear}, inclusive`);
  }
  if (options.year % 1 !== 0) {
    throw new Error(`Invalid option. I honestly wrote this check as a joke. Who hurt you?`);
  }
  const libraryRoot = readProjectConfiguration(tree, 'solver').root;
  if (tree.exists(joinPathFragments(libraryRoot, `src/lib/${options.year}`))) {
    throw new Error(`Invalid destination: Path [src/lib/${options.year}] is not empty`);
  }
  for (let day = 1; day <= 24; day++) {
    generateFiles(tree, joinPathFragments(__dirname, 'files'), libraryRoot, {
      ...options,
      day,
      paddedDay: `${day < 10 ? '0' : ''}${day}`,
    });
  }
  tree.write(
    joinPathFragments(libraryRoot, `src/lib/${options.year}/Day25.ts`),
    Buffer.from("import { input, output } from '../solver';\n\noutput('Day 25');\n"),
  );
  await formatFiles(tree);
};

export default solverGenerator;

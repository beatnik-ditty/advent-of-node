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
  if (tree.exists(joinPathFragments(libraryRoot, `src/lib/solvers/${options.year}`))) {
    throw new Error(`Invalid destination: Path [solvers/${options.year}] is not empty`);
  }
  for (let i = 1; i <= 24; i++) {
    generateFiles(tree, joinPathFragments(__dirname, 'solvers'), libraryRoot, {
      ...options,
      day: i,
      paddedDay: `${i < 10 ? '0' : ''}${i}`,
    });
  }
  generateFiles(tree, joinPathFragments(__dirname, 'singles'), libraryRoot, options);
  updateSolverIndex(tree, libraryRoot, options.year);
  await formatFiles(tree);
};

const updateSolverIndex = (tree: Tree, libraryRoot: string, year: number) => {
  const filePath = joinPathFragments(libraryRoot, 'src/lib/solvers/index.ts');
  const solverIndex = tree.read(filePath);

  if (solverIndex) {
    const indexTs = solverIndex.toString();
    const years = [...indexTs.matchAll(/'.\/(\d{4})'/g)].map(match => parseInt(match[1]));
    years.push(year);
    tree.write(
      filePath,
      Buffer.concat(
        years
          .filter((year, index) => years.indexOf(year) === index)
          .sort()
          .map(year => Buffer.from(`export * from './${year}';\n`)),
      ),
    );
  }
};

export default solverGenerator;

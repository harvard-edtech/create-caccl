/**
 * Contents of a tsconfig file
 * @author Gabe Abrams
 */
const tsconfigContents = (
`{
  "compilerOptions": {
    "module": "commonjs",
    "esModuleInterop": true,
    "noImplicitAny": true,
    "noEmitOnError": true,
    "removeComments": false,
    "declaration": true,
    "sourceMap": true,
    "target": "es5",
    "lib": ["DOM", "ES5"],
    "outDir": "./build"
  },
  "include": [
    "./src"
  ],
  "ts-node": {
    "files": true
  }
}`
);

export default tsconfigContents;

/**
 * Contents of a tsconfig file
 * @author Gabe Abrams
 */
declare const tsconfigContents = "{\n  \"compilerOptions\": {\n    \"module\": \"commonjs\",\n    \"esModuleInterop\": true,\n    \"noImplicitAny\": true,\n    \"noEmitOnError\": true,\n    \"removeComments\": false,\n    \"declaration\": true,\n    \"sourceMap\": true,\n    \"target\": \"es5\",\n    \"lib\": [\"DOM\", \"ES5\"],\n    \"outDir\": \"./build\"\n  },\n  \"include\": [\n    \"./src\"\n  ],\n  \"ts-node\": {\n    \"files\": true\n  }\n}";
export default tsconfigContents;

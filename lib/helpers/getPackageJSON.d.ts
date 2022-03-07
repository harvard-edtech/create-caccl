/**
 * Read a package.json file
 * @param filename
 * @returns package json contents
 */
declare const getPackageJSON: (filename: string) => {
    [k: string]: any;
};
export default getPackageJSON;

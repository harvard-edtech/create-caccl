declare const print: {
    /**
     * Print a title
     * @author Gabe Abrams
     * @param str text to print
     */
    title: (str: string) => void;
    /**
     * Print a sub title (subheading)
     * @author Gabe Abrams
     * @param str text to print
     */
    subtitle: (str: string) => void;
    /**
     * Print centered text
     * @author Gabe Abrams
     * @param str text to print
     */
    centered: (str: string) => void;
    /**
     * Print a fatal error message
     * @author Gabe Abrams
     * @param err error message
     */
    fatalError: (err: string) => never;
    /**
     * Save a copy of the prompt instance
     * @author Gabe Abrams
     * @param promptInstance instance of prompt-sync
     */
    savePrompt: (promptInstance: any) => void;
    /**
     * Ask the user to press enter before continuing
     * @author Gabe Abrams
     */
    enterToContinue: () => void;
};
export default print;

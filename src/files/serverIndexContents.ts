/**
 * Contents of the server index.ts file
 * @author Gabe Abrams
 */
const serverIndexContents = (
`import initCACCL from 'caccl/server';

/**
 * Initialize app server
 */
const initServer = async () => {
  // Initialize CACCL
  const app = await initCACCL({
    // TODO: configure CACCL
  });
};

// Init server and display errors
initServer();
`
);

export default serverIndexContents;

const ALLOWED_PATHS = ['/frontend'];

const init = () => {
  const currentPath = window.location.pathname;
  
  if (!ALLOWED_PATHS.some(path => currentPath.startsWith(path))) {
    return;
  }

  console.log('AlgoChat initialized on Algochurn frontend questions page');
  // Your chat interface initialization code will go here
};

init(); 
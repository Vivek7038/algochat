export const cleanHtml = (html: string): string => {
  // Create a temporary div to parse HTML
  const temp = document.createElement('div');
  temp.innerHTML = html;

  // Remove only code elements that don't have the language-javascript class
  const codeElements = temp.querySelectorAll('code:not(.language-javascript)');
  codeElements.forEach(code => {
    code.remove();
  });

  // For code elements with language-javascript class, preserve their text content
  const jsCodeElements = temp.querySelectorAll('code.language-javascript');
  jsCodeElements.forEach(code => {
    // Create a wrapper to maintain the code context
    const wrapper = document.createElement('span');
    wrapper.textContent = `\`${code.textContent}\``; // Wrap in backticks for clarity
    code.parentNode?.replaceChild(wrapper, code);
  });

  // Remove image elements
  const imgElements = temp.querySelectorAll('img');
  imgElements.forEach(img => {
    img.remove();
  });

  // Get text content and clean it
  let text = temp.textContent || '';
  
  // Remove extra whitespace while preserving backtick-wrapped code
  text = text
    .replace(/\s+/g, ' ')
    .replace(/\s+`/g, ' `') // Clean space before backticks
    .replace(/`\s+/g, '` ') // Clean space after backticks
    .trim();
  
  return text;
};

export const getProblemStatement = (): string => {
  const problemElement = document.querySelector('.language-javascript.action-window-markdown');
  
  if (!problemElement) {
    return '';
  }

  // Clone the element to avoid modifying the actual DOM
  const clonedElement = problemElement.cloneNode(true) as HTMLElement;
  
  // Clean and get the text
  const cleanedText = cleanHtml(clonedElement.innerHTML);
  
  return cleanedText;
}; 
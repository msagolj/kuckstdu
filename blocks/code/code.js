export default function decorate(block) {

  // get the code element containing the code to syntax highlight

  let code = block.querySelector("code");

  // check if a syntax language was explicitly set as block class
  block.className.split(" ").forEach((entry) => {
    // if there is a 3rd class entry it's the language
    if( entry !== "code" && entry !== "block") {
      // set it on the <CODE> element
      code.classList.add("language-"+entry);
    } 
  });

  // do the syntax highlighting 
  hljs.highlightElement(code);
}


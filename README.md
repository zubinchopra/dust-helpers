# DustJS Helpers README

DustJS is primarily used for frontend development. To handle the eccentricities and quirks of the language, the following extension provides some features to reduce time required to develop component efficiently.

## Features

* Autocomplete for import statements when open in a workspace. <br />
  ![ezgif com-gif-maker (9)](https://user-images.githubusercontent.com/14044105/213061378-3f934c47-71f6-42cd-8a7a-907fa0b41ba1.gif) <br />
* Shorthand key combinations to generate code blocks for the following:
  * :addToContext/ -> Generates a template for add to context helper with name param
    ![ezgif com-gif-maker](https://user-images.githubusercontent.com/14044105/213060086-6c08f982-1865-49f5-9d66-937ad3872fa3.gif) <br />
  * math helpers -> Generated templates for math helpers with operand, operation and key parameters. The expression also includes a nested `@eq` helper for evaluating the value developer would obtain from the computed expression. 
    * :add/ || :+/ <br />
      ![ezgif com-gif-maker (1)](https://user-images.githubusercontent.com/14044105/213060366-d2ba7f27-c195-402d-b8e7-b15ef498b1be.gif) <br />
    * :subtract/ || :-/ <br />
      ![ezgif com-gif-maker (2)](https://user-images.githubusercontent.com/14044105/213060639-4b2b3fd5-f229-428a-8597-587ee3ed7db0.gif)<br />
    * :divide/ || :// <br />
      ![ezgif com-gif-maker (3)](https://user-images.githubusercontent.com/14044105/213060729-f137c8a9-091a-44f4-8184-002005e3b1c6.gif) <br />
    * :multiply/ || :*/ <br />
      ![ezgif com-gif-maker (4)](https://user-images.githubusercontent.com/14044105/213060781-33b6dc38-e0ab-4a49-97d3-14162b851816.gif)<br />
    * :mod/ || :%/ <br />
      ![ezgif com-gif-maker (5)](https://user-images.githubusercontent.com/14044105/213060869-c5fd2437-edef-4e8f-a6d1-f9fbff1ac2c2.gif)<br />
* :select/ -> Generates a template for select helper with key param <br />
  ![ezgif com-gif-maker (6)](https://user-images.githubusercontent.com/14044105/213061026-323b6b0a-44df-4dd4-b313-61302f50afe5.gif) <br />
* :eq/ || :if/ -> Generates equality helper with key and value params. It also includes an else clause <br />
  ![ezgif com-gif-maker (7)](https://user-images.githubusercontent.com/14044105/213061138-f594d038-ebdd-4ab2-a747-e79b3162baa7.gif) <br />
* :wd/ || :cd/ || :directory/ || :cwd/ :campaigndirectory/ -> Generates the current working directory. It is especially useful when trying to import other fragmented components in the current directory into a given component. You can also use the path autocomplete feature in tandem with this generator.
  ![ezgif com-gif-maker (8)](https://user-images.githubusercontent.com/14044105/213061249-5a333e08-f657-4da7-be91-30e46556775c.gif) <br />

## Known Issues

* The path autocomplete is not smart enough yet to provide the list of parameters that the imported component expects.
* Certain features such as the file autocomplete, only work when the VS code has a workspace open. What that means is that a folder has to be open from at max the flock directory level for the imports to work as expected.
* There can be some issues around what all characters are deleted when a shorthand key combination is replaced with generated content. The feature has been tested with import statements and has checks around that. However, the developer will still need to indent the generated code as it always replaces the entire line the shorthand is written on starting from index 0.
* The user would have to type through the entire helper shorthand followed by a forward slash: ‘/’ to actually make the extension work.


## Release Notes

Initial release.

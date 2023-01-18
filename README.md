# DustJS Helpers README

DustJS is primarily used for frontend development. To handle the eccentricities and quirks of the language, the following extension provides some features to reduce time required to develop component efficiently.

## Features

* Autocomplete for import statements when open in a workspace.
* Shorthand key combinations to generate code blocks for the following:
  * :addToContext/ -> Generates a template for add to context helper with name param
    ![ezgif com-gif-maker](https://user-images.githubusercontent.com/14044105/213060086-6c08f982-1865-49f5-9d66-937ad3872fa3.gif)
  * math helpers -> Generated templates for math helpers with operand, operation and key parameters. The expression also includes a nested `@eq` helper for evaluating the value developer would obtain from the computed expression. 
    * :add/ || :+/ <br />
      ![ezgif com-gif-maker (1)](https://user-images.githubusercontent.com/14044105/213060366-d2ba7f27-c195-402d-b8e7-b15ef498b1be.gif)
    * :subtract/ || :-/
    * :divide/ || ://
    * :multiply/ || :*/
    * :mod/ || :%/
* :select/ -> Generates a template for select helper with key param
* :eq/ || :if/ -> Generates equality helper with key and value params. It also includes an else clause
* :wd/ || :cd/ || :directory/ || :cwd/ :campaigndirectory/ -> Generates the current working directory. It is especially useful when trying to import other fragmented components in the current directory into a given component. You can also use the path autocomplete feature in tandem with this generator.

## Known Issues

* The path autocomplete is not smart enough yet to provide the list of parameters that the imported component expects.
* Certain features such as the file autocomplete, only work when the VS code has a workspace open. What that means is that a folder has to be open from at max the flock directory level for the imports to work as expected.
* There can be some issues around what all characters are deleted when a shorthand key combination is replaced with generated content. The feature has been tested with import statements and has checks around that. However, the developer will still need to indent the generated code as it always replaces the entire line the shorthand is written on starting from index 0.
* The user would have to type through the entire helper shorthand followed by a forward slash: ‘/’ to actually make the extension work.


## Release Notes

Initial release.

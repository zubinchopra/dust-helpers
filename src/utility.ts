import * as vscode from 'vscode';

enum ExtensionCommand {
  equality = 'extension.insertEq',
  math = 'extension.insertMath',
  addToContext = 'extension.insertAddToContext',
  select = 'extension.insertSelect',
  componentDirectory = 'extension.insertComponentDirectory',
  comparison = 'extension.insertComparison'
}

const generateDisposable = (extensionCommand: ExtensionCommand): vscode.Disposable => {
  return vscode.commands.registerCommand(
    extensionCommand, 
    (editor: vscode.TextEditor, operatorSymbol: String = '', linePrefix: String = '') => {
      if (!editor) {
        return;
      }

      const range = getCurrentSelectionRangeFromStart(editor);
      const snippetString = getSnippetString(extensionCommand, operatorSymbol, linePrefix);
      editor.insertSnippet(snippetString, range);
    }
  );
};

const getSnippetString = (extensionCommand: ExtensionCommand, operatorSymbol?: String, linePrefix?: String): vscode.SnippetString => {
  switch (extensionCommand) {
    case ExtensionCommand.equality:
      return new vscode.SnippetString(
        `{@eq key="" value=""}\n{:else}\n{/eq}`
      );
    case ExtensionCommand.math:
      let operation = '';
      if (operatorSymbol?.match(/add|\+/)) {
        operation = 'add';
      } else if (operatorSymbol?.match(/subtract|\-/)) {
        operation = 'subtract';
      } else if (operatorSymbol?.match(/divide|\//)) {
        operation = 'divide';
      } else if (operatorSymbol?.match(/multiply|\*/)) {
        operation = 'multiply';
      } else if (operatorSymbol?.match(/mod|\%/)) {
        operation = 'mod';
      }
      
      return new vscode.SnippetString(`{@math method="${operation}" key="" operand=""}\n\t{@eq value=""}\n\t\t\n\t{/eq}\n{/math}`);
    case ExtensionCommand.addToContext:
      return new vscode.SnippetString(`{@addToContext name=""}\n\t\n{/addToContext}`);
    case ExtensionCommand.select:
      return new vscode.SnippetString(`{@select key=""}\n\t\n{/select}`);
    case ExtensionCommand.componentDirectory:
      const currentFilePath = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.fileName : '';
      const currentWorkingFolderRegex = /flock\/(email\/.*\/)|flock\/(shared\/.*\/.*\/)/;
      const currentWorkingFolder = currentWorkingFolderRegex.exec(currentFilePath);
      const snippetString = new vscode.SnippetString('');
      if (currentWorkingFolder) {
        snippetString.value = currentWorkingFolder[0];
      }
      
      return snippetString;
    case ExtensionCommand.comparison:
      if (linePrefix?.match(/:gt\//)) {
        return new vscode.SnippetString(`{@gt key="" value="" type=""}\n\t\n{/gt}`);
      }

      return new vscode.SnippetString(`{@lt key="" value="" type=""}\n\t\n{/lt}`);
    default:
      return new vscode.SnippetString('');
  }
};

const getCurrentSelectionRangeFromStart = (editor: vscode.TextEditor): vscode.Range => {
  const selection = editor.selection;
  const currentLineNumber = selection.start.line;
  let startCharIndex = 0; 
  if (vscode.window.activeTextEditor) {
    if (vscode.window.activeTextEditor.document.lineAt(currentLineNumber).text.startsWith('{>"')) {
      startCharIndex = 3;
    }
  }
  
  const start = new vscode.Position(currentLineNumber, startCharIndex);
  const range = new vscode.Range(start, selection.end);
  return range;
};

export {
  generateDisposable,
  getCurrentSelectionRangeFromStart,
  ExtensionCommand
};
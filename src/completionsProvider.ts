import * as vscode from 'vscode';
import * as glob from 'glob-promise';
import * as fs from 'fs/promises';
import {
  generateDisposable,
  ExtensionCommand
} from './utility';

const completionsProvider = vscode.languages.registerCompletionItemProvider(
  'dustjs',
  {
    async provideCompletionItems(document, position) {

      const linePrefix = document.lineAt(position).text;
      const editor = vscode.window.activeTextEditor;
      
      if (linePrefix.match(/:(if|eq)\//) && editor) {
        const eqCompletionItem = getEqCompletionItem(editor);
        return [eqCompletionItem];
      }

      if (linePrefix.match(/:(\+|add|\-|subtract|\/\/|divide|\*|multiply|\%|mod)\//) && editor) {
        const mathCompletionItem = getMathCompletionItem(editor, linePrefix);
        return [mathCompletionItem];
      }

      if (linePrefix.match(/:(wd|cd|directory|cwd|campaigndirectory)\//) && editor) {
        const currentWorkingFolderItem = getCurrentWorkingFolder(editor);
        return [currentWorkingFolderItem];
      }
      
      if (linePrefix.match(/\{\>\"/)) {
        const pathCompletionItems = await getPathCompletionItems(linePrefix, position);
        return pathCompletionItems;
      }

      if (linePrefix.match(/:(atc|context|addToContext)\//) && editor) {
        const addToContextCompletionItem = getAddToContextCompletionItem(editor);
        return [addToContextCompletionItem];
      }

      if (linePrefix.match(/:(select)\//) && editor) {
        const selectCompletionItem = getSelectCompletionItem(editor);
        return [selectCompletionItem];
      }

      if (linePrefix.match(/:(lt|gt)\//) && editor) {
        const comparisonCompletionItem = getcomparisonCompletionItem(editor, linePrefix);
        return [comparisonCompletionItem];
      }

      return undefined;
    }
  },
  '/'
);

const getEqCompletionItem = (editor: vscode.TextEditor): vscode.CompletionItem => {
  const snippetCompletion = new vscode.CompletionItem('@eq');
  snippetCompletion.kind = vscode.CompletionItemKind.Snippet;
  snippetCompletion.command = {
    title: 'Insert equality helper',
    command: ExtensionCommand.equality,
    arguments: [editor]
  };

  return snippetCompletion;
};

const getMathCompletionItem = (editor: vscode.TextEditor, operatorSymbol: String): vscode.CompletionItem => {
  const snippetCompletion = new vscode.CompletionItem('');
  switch (true) {
    case !!operatorSymbol.match(/:(add|\+)/):
      snippetCompletion.label = '@math add';
      break;
    case !!operatorSymbol.match(/:(subtract|\-)/):
      snippetCompletion.label = '@math subtract';
      break;
    case !!operatorSymbol.match(/:(divide|\/\/)/):
      snippetCompletion.label = '@math divide';
      break;
    case !!operatorSymbol.match(/:(multiply|\*)/):
      snippetCompletion.label = '@math multiply';
      break;
    case !!operatorSymbol.match(/:(mod|\%)/):
      snippetCompletion.label = '@math mod';
      break;
  }

  //const snippetCompletion = new vscode.CompletionItem('@eq');
  snippetCompletion.kind = vscode.CompletionItemKind.Snippet;
  snippetCompletion.command = {
    title: 'Insert math helper',
    command: ExtensionCommand.math,
    arguments: [editor, operatorSymbol]
  };

  return snippetCompletion;
};

const getPathCompletionItems = async (linePrefix: String, position: vscode.Position): Promise<vscode.CompletionItem[]> => {
  const searchTerm = linePrefix.substring(3, position.character);
  const currentDirectory = vscode.workspace.workspaceFolders ? 
    vscode.workspace.workspaceFolders[0].uri.fsPath : process.cwd();
  const items = [];
  
  try {
    const searchPattern = `${currentDirectory}/${searchTerm}*`;
    const entities = await glob(searchPattern);

    for (const entity of entities) {
    let trimmedEntity = entity.split('/').pop();
    const item = new vscode.CompletionItem(trimmedEntity!);
    (await fs.lstat(entity)).isFile() ?
      item.kind = vscode.CompletionItemKind.File :
      item.kind = vscode.CompletionItemKind.Folder;
    items.push(item);
    }

    return items;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getAddToContextCompletionItem = (editor: vscode.TextEditor) => {
  const snippetCompletion = new vscode.CompletionItem('@addToContext');
  snippetCompletion.kind = vscode.CompletionItemKind.Snippet;
  snippetCompletion.command = {
    title: 'Insert add to context helper',
    command: ExtensionCommand.addToContext,
    arguments: [editor]
  };

  return snippetCompletion;
};

const getSelectCompletionItem = (editor: vscode.TextEditor) => {
  const snippetCompletion = new vscode.CompletionItem('@select');
  snippetCompletion.kind = vscode.CompletionItemKind.Snippet;
  snippetCompletion.command = {
    title: 'Insert select helper',
    command: ExtensionCommand.select,
    arguments: [editor]
  };

  return snippetCompletion;
};

const getCurrentWorkingFolder = (editor: vscode.TextEditor) => {
  const currentFilePath = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.document.fileName : '';
  const currentWorkingFolderRegex = /flock\/(email\/.*\/)|flock\/(shared\/.*\/.*\/)/;
  const currentWorkingFolder = currentWorkingFolderRegex.exec(currentFilePath);
  const snippetCompletion = new vscode.CompletionItem('');
  if (currentWorkingFolder) {
    snippetCompletion.label = currentWorkingFolder[0];
    snippetCompletion.command = {
      title: 'Insert current working component directory',
      command: ExtensionCommand.componentDirectory,
      arguments: [editor]
    };
  }

  return snippetCompletion;
};

const getcomparisonCompletionItem = (editor: vscode.TextEditor, linePrefix: String) => {
  const snippetCompletion = new vscode.CompletionItem('');
  snippetCompletion.kind = vscode.CompletionItemKind.Snippet;
  if (linePrefix.match(/:gt\//)) {
    snippetCompletion.label = '@gt';
  } else {
    snippetCompletion.label = '@lt';
  }

  snippetCompletion.command = {
    title: `Insert ${linePrefix.match(/:gt\//) ? 'greater than' : 'less than'} helper`,
    command: ExtensionCommand.comparison,
    arguments: [editor, '', linePrefix]
  };

  return snippetCompletion;
};

const eqDisposable = generateDisposable(ExtensionCommand.equality);
const mathDisposable = generateDisposable(ExtensionCommand.math);
const addToContextDisposable = generateDisposable(ExtensionCommand.addToContext);
const selectDisposable = generateDisposable(ExtensionCommand.select);
const componentDirectoryDisposable = generateDisposable(ExtensionCommand.componentDirectory);
const comparisonDisposable = generateDisposable(ExtensionCommand.comparison);

export { 
  completionsProvider,
  eqDisposable,
  mathDisposable,
  addToContextDisposable,
  selectDisposable,
  componentDirectoryDisposable,
  comparisonDisposable
};
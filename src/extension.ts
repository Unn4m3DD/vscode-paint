// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from "fs";
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "vscode-paint" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('vscode-paint.helloWorld', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    let view = vscode.window.createWebviewPanel("vscode paint", "asd", vscode.ViewColumn.One, {
      enableScripts: true,
    });
    const onDiskPath = vscode.Uri.file(
      path.join(context.extensionPath, 'out', 'script.js')
    );
    view.webview.html = getWebviewContent(onDiskPath.fsPath);
    vscode.window.showInformationMessage('Hello World from vscode-paint!');
  });

  context.subscriptions.push(disposable);
}
function getWebviewContent(uri: string) {
  return `<!DOCTYPE html>
<html lang="en" style="width: 100%; height: 100%; margin: 0px;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body style="width: 100%; height: 100%; margin: 0px;" id="body">
  <canvas id="canvas" style="width: 100%; height: 100%; margin: 0px; display:block;" 
    width="1600" height="900"
  ></canvas>
</body>
<script> ${fs.readFileSync(uri).toString()} </script>
</html>`;
}
// this method is called when your extension is deactivated
export function deactivate() { }

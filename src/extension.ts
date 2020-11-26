import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from "fs";
export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('vscode-paint.open', () => {
    let view = vscode.window.createWebviewPanel("VSCode Paint", "paint", vscode.ViewColumn.One, {
      enableScripts: true,
    });
    view.webview.html = getWebviewContent([
      vscode.Uri.file(path.join(context.extensionPath, 'out', 'setup.js')).fsPath,
      vscode.Uri.file(path.join(context.extensionPath, 'out', 'button.js')).fsPath,
      vscode.Uri.file(path.join(context.extensionPath, 'out', 'script.js')).fsPath
    ]);
  });

  context.subscriptions.push(disposable);
}
function getWebviewContent(uris: string[]) {
  let js = "";
  for (let uri of uris) {
    js += "\n" + fs.readFileSync(uri).toString();
  }
  return `<!DOCTYPE html>
<html lang="en" style="width: 100%; height: 100%; margin: 0px;">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body style="width: 100%; height: 100%; margin: 0px;" id="body">
  <div style="position: relative;">
    <canvas id="canvas" style="position: absolute; left: 0; top: 0; z-index: 1;"
    width="1600" height="900"></canvas>
    <canvas id="drawing_canvas" style="position: absolute; left: 0; top: 0; z-index: 0;"
    width="1600" height="900"></canvas>
  </div>
</body>
<script> ${js} </script>
</html>`;
}
// this method is called when your extension is deactivated
export function deactivate() { }

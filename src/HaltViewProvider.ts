import * as vscode from "vscode";
import type { PostMessageOptions } from "./view/globals.d.ts";

export type ViewType = "halt.view";

export class HaltViewProvider {
  panel?: vscode.WebviewPanel;

  readonly type: ViewType = "halt.view";

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public show(): void {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    const panel = vscode.window.createWebviewPanel(
      this.type,
      "Halt",
      column || vscode.ViewColumn.One
    );

    panel.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };

    panel.webview.html = this._getHtmlForWebview(panel.webview);

    // Listen for messages from the Sidebar component and execute action
    panel.webview.onDidReceiveMessage(
      async (data: PostMessageOptions): Promise<void> => {
        switch (data.type) {
          case "onOpen": {
            this._handleOnOpen(panel);
            break;
          }
          case "onInfo": {
            if (!data.value) {
              return;
            }
            vscode.window.showInformationMessage(data.value as string);
            break;
          }
          case "onError": {
            if (!data.value) {
              return;
            }
            vscode.window.showErrorMessage(data.value as string);
            break;
          }
        }
      }
    );
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    // const styleResetUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "src", "styles/reset.css")
    // );
    // const styleVSCodeUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "src", "styles/vscode.css")
    // );
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "out", "view.js")
    );

    // const styleMainUri = webview.asWebviewUri(
    //   vscode.Uri.joinPath(this._extensionUri, "dist", "./index.css")
    // );
    // <link href="${styleMainUri}" rel="stylesheet"> - put in head

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    // <link href="${styleResetUri}" rel="stylesheet">
    // <link href="${styleVSCodeUri}" rel="stylesheet">
    return /* html */ `
    <!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${webview.cspSource}; script-src 'nonce-${nonce}';">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script nonce = "${nonce}">
          const tsvscode = acquireVsCodeApi();
        </script>
			</head>
      <body>
      <p>Hello world</p>
        <script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
		</html>`;
  }

  private async _handleOnOpen(webviewView: vscode.WebviewPanel): Promise<void> {
    webviewView.webview.postMessage({
      type: "ping",
      value: true,
    });
  }
}

export const getNonce = (length: number = 32) => {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
const api = gitExtension.getAPI(1);

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "diff-gen" is now active!');

    const disposable = vscode.commands.registerCommand('diff-gen.createDiff', async () => {
        const repository = api.repositories[0];
        const changes = repository.state.workingTreeChanges;

        let diffContent = '';

        for (const change of changes) {
            const diff = await repository.diffWithHEAD(change.uri.fsPath);
            diffContent += diff + '\n';
        }

        const diffFilePath = path.join(vscode.workspace.rootPath || '', 'output.diff');
        fs.writeFileSync(diffFilePath, diffContent, 'utf8');
        vscode.window.showInformationMessage('Diff created: output.diff');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
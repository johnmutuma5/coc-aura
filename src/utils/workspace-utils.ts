import { shared as lspCommon } from '@salesforce/lightning-lsp-common';
import {WorkspaceType} from '@salesforce/lightning-lsp-common/lib/shared';
import {Uri, workspace} from 'coc.nvim';
import {Workspace} from 'coc.nvim/lib/workspace';

export function checkWorkspaceFolders(workspace: Workspace): void {
  !(workspace.workspaceFolders?.length) &&
    workspace.workspaceFolders.push(workspace.workspaceFolder && workspace.workspaceFolder);

  if(!workspace.workspaceFolders?.length) {
    throw new Error('No workspaceFolders found');
  }
}

export function checkAuraWorkspace(): void {
  const workspaceRoots: string[] = [];
  workspace.workspaceFolders.forEach(folder => {
    workspaceRoots.push(Uri.parse(folder.uri).fsPath);
  });
  const workspaceType: WorkspaceType = lspCommon.detectWorkspaceType(workspaceRoots);
  if(!lspCommon.isLWC(workspaceType)){
    console.log('Could not detect a ligtning project structure. Exiting ...');
    throw new Error('No valid lightning workspace detected');
  }
}

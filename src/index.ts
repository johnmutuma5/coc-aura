import { workspace, ExtensionContext, LanguageClient } from 'coc.nvim';
import setupAuraServerClient from './client';
import {checkAuraWorkspace, checkWorkspaceFolders} from './utils';

export async function activate(context: ExtensionContext) {
  try {
    checkWorkspaceFolders(workspace);
    checkAuraWorkspace();
  } catch(error) {
    console.error(`${error.name}: ${error.message}`);
    return;
  }

  console.info('Lightning workspace detected. Starting Aura Server now!!');
  const client: LanguageClient = setupAuraServerClient(context);
  client.onReady().then(() => console.info('Success!! Aura client ready'));
  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(client.start());
}

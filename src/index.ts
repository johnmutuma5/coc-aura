import {
  LanguageClient,
  LanguageClientOptions,
  workspace,
  ExtensionContext,
  ServerOptions,
  TransportKind
} from 'coc.nvim';
import * as path from 'path';

export async function activate(context: ExtensionContext) {
  startAuraLangServer(context);
}

function startAuraLangServer(context: ExtensionContext) {
  // Setup the language server
  const serverModule = context.asAbsolutePath(
    path.join(
      'node_modules',
      '@salesforce',
      'aura-language-server',
      'lib',
      'server.js'
    )
  );

  !(workspace.workspaceFolders?.length) && workspace.workspaceFolders.push(workspace.workspaceFolder);

  const debugOptions = { execArgv: ['--nolazy', '--inspect=6020'] };
  const serverOptions: ServerOptions = {
    run: {
      module: serverModule,
      transport: TransportKind.ipc
    },
    debug: {
      module: serverModule,
      transport: TransportKind.ipc,
      options: debugOptions
    }
  };

  const clientOptions: LanguageClientOptions = {
    outputChannelName: 'Aura LS',
    documentSelector: [
      { language: 'html', scheme: 'file' },
      { language: 'html', scheme: 'untitled' },
      { language: 'javascript', scheme: 'file' },
      { language: 'javascript', scheme: 'untitled' }
    ],
    synchronize: {
      fileEvents: [
        workspace.createFileSystemWatcher('**/*.resource'),
        workspace.createFileSystemWatcher(
          '**/labels/CustomLabels.labels-meta.xml'
        ),
        workspace.createFileSystemWatcher(
          '**/staticresources/*.resource-meta.xml'
        ),
        workspace.createFileSystemWatcher('**/contentassets/*.asset-meta.xml'),
        workspace.createFileSystemWatcher('**/lwc/*/*.js'),
        workspace.createFileSystemWatcher('**/modules/*/*/*.js'),
        // need to watch for directory deletions as no events are created for contents or deleted directories
        workspace.createFileSystemWatcher('**/', false, true, false)
      ]
    }
  };

  // Create the language client and start the client.
  const client = new LanguageClient(
    'auraLanguageServer',
    'Aura Language Server',
    serverOptions,
    clientOptions
  ).start();

  // Push the disposable to the context's subscriptions so that the
  // client can be deactivated on extension deactivation
  context.subscriptions.push(client);
}

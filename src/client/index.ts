import {ExtensionContext, LanguageClient, LanguageClientOptions, ServerOptions, TransportKind, workspace} from "coc.nvim";
import * as path from 'path';

export default function setupAuraServerClient(context: ExtensionContext): LanguageClient {
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


  const debugOptions = { execArgv: ['--nolazy', '--inspect=6009'] };
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
    outputChannelName: 'AURA',
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
  return new LanguageClient(
    'auraLanguageServer',
    'Aura Language Server',
    serverOptions,
    clientOptions
  );
}

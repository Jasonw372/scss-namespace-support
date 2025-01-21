// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

interface NamespaceInfo {
	namespace: string;
	originalPath: string;
	fullPath: string;
	alias?: string;
	isBuiltin?: boolean;  // 标记是否为内置模块
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('SCSS Namespace Support is now active');


	// 注册自动补全提供器
	const provider = new ScssNamespaceCompletionProvider();
	const selector = { language: 'scss', scheme: 'file' };
	
	// 注册补全提供器，并指定触发字符
	context.subscriptions.push(
		vscode.languages.registerCompletionItemProvider(
			selector,
			provider,
			'.',  // 在输入点号后触发
			'@'   // 在输入@符号后触发
		)
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}

// 创建自动补全提供器
class ScssNamespaceCompletionProvider implements vscode.CompletionItemProvider {
	// 添加内置模块列表
	private readonly builtinModules = [
		{ name: 'math', description: 'Provides mathematical functions' },
		{ name: 'color', description: 'Provides color manipulation functions' },
		{ name: 'string', description: 'Provides string manipulation functions' },
		{ name: 'list', description: 'Provides list manipulation functions' },
		{ name: 'map', description: 'Provides map manipulation functions' },
		{ name: 'selector', description: 'Provides selector manipulation functions' },
		{ name: 'meta', description: 'Provides meta-programming functions' }
	];

	provideCompletionItems(
		document: vscode.TextDocument,
		position: vscode.Position,
		token: vscode.CancellationToken,
		context: vscode.CompletionContext
	): vscode.ProviderResult<vscode.CompletionItem[]> {
		const lineText = document.lineAt(position).text;
		const textBeforeCursor = lineText.substring(0, position.character);
		
		if (!this.shouldProvideCompletion(textBeforeCursor)) {
			return undefined;
		}

		// 合并内置模块和用户导入的模块
		const userNamespaces = this.parseUseStatements(document);
		const builtinNamespaces = this.getBuiltinNamespaces();
		return this.createCompletionItems([...userNamespaces, ...builtinNamespaces]);
	}

	private shouldProvideCompletion(textBeforeCursor: string): boolean {
		// 移除对 sass: 前缀的特殊处理
		return /[@\s][\w-]*$/.test(textBeforeCursor) || 
			   textBeforeCursor.trim().startsWith('@use');
	}

	private parseUseStatements(document: vscode.TextDocument): NamespaceInfo[] {
		const text = document.getText();
		// 支持 @use 'path' 和 @use 'path' as alias 两种格式
		const useRegex = /@use\s+['"]([^'"]+)['"]\s*(?:as\s+([^;]+))?/g;
		const namespaces: NamespaceInfo[] = [];
		const documentDir = path.dirname(document.uri.fsPath);

		let match;
		while ((match = useRegex.exec(text)) !== null) {
			const importPath = match[1];
			const alias = match[2]?.trim();
			
			// 检查是否是内置模块
			if (importPath.startsWith('sass:')) {
				// 对于内置模块，直接使用模块名作为命名空间
				const moduleName = importPath.replace('sass:', '');
				if (this.builtinModules.some(m => m.name === moduleName)) {
					continue; // 跳过内置模块，因为它们已经由 getBuiltinNamespaces 处理
				}
			}
			
			// 解析完整路径
			const fullPath = this.resolveScssPath(importPath, documentDir);
			const defaultNamespace = path.basename(importPath, path.extname(importPath))
				.replace('sass:', ''); // 移除可能存在的 sass: 前缀
			
			// 如果有别名就用别名，否则用默认命名空间
			namespaces.push({
				namespace: alias || defaultNamespace,
				originalPath: importPath,
				fullPath: fullPath || importPath,
				alias: alias
			});
		}
		
		return namespaces;
	}

	private resolveScssPath(importPath: string, baseDir: string): string {
		// 尝试不同的文件扩展名
		const extensions = ['.scss'];
		
		// 如果是相对路径，从当前文件目录解析
		if (importPath.startsWith('.')) {
			const absolutePath = path.resolve(baseDir, importPath);
			
			// 尝试不同的扩展名
			for (const ext of extensions) {
				const pathWithExt = absolutePath + ext;
				if (fs.existsSync(pathWithExt)) {
					return pathWithExt;
				}
			}
			
			// 尝试作为目录查找 _index.scss
			const indexPath = path.join(absolutePath, '_index.scss');
			if (fs.existsSync(indexPath)) {
				return indexPath;
			}
		}
		
		return importPath;
	}

	private getBuiltinNamespaces(): NamespaceInfo[] {
		return this.builtinModules.map(module => ({
			namespace: module.name,  // 直接使用模块名，不带 sass: 前缀
			originalPath: `sass:${module.name}`,  // 保留原始路径中的 sass: 前缀
			fullPath: `sass:${module.name}`,
			isBuiltin: true
		}));
	}

	private createCompletionItems(namespaces: NamespaceInfo[]): vscode.CompletionItem[] {
		return namespaces.map(ns => {
			const item = new vscode.CompletionItem(ns.namespace, vscode.CompletionItemKind.Module);
			
			if (ns.isBuiltin) {
				item.detail = `Sass Built-in Module`;
				const builtinModule = this.builtinModules.find(m => m.name === ns.namespace);
				item.documentation = new vscode.MarkdownString()
					.appendText(`Import with: @use '${ns.originalPath}'`)
					.appendText(`\n\n${builtinModule?.description || ''}`);
			} else {
				item.detail = `SCSS Namespace${ns.alias ? ' (alias)' : ''}`;
				item.documentation = new vscode.MarkdownString()
					.appendText(`Original import: @use '${ns.originalPath}'`)
					.appendText(ns.alias ? `\nAliased as: ${ns.alias}` : '');
			}
			
			item.command = {
				command: 'editor.action.triggerSuggest',
				title: 'Trigger suggestions'
			};
			
			return item;
		});
	}
}
# SCSS Namespace Support / SCSS 命名空间支持

A VS Code extension that provides autocompletion for SCSS namespaces from @use statements.

一个为 VS Code 提供 SCSS @use 语句命名空间自动补全的扩展。

## Features / 功能特性

- Automatically detects and parses @use statements in SCSS files
- Provides namespace autocompletion
- Supports alias syntax
- Triggers completion suggestions after `.` or `@`
- Shows original import path and alias information

---

- 自动检测并解析 SCSS 文件中的 @use 语句
- 支持命名空间自动补全
- 支持别名（as）语法
- 在输入 `.` 或 `@` 后触发补全建议
- 显示原始导入路径和别名信息

## Usage / 使用方法

1. Use @use statements in your SCSS files to import other SCSS files:
   在 SCSS 文件中使用 @use 语句导入其他 SCSS 文件：
   ```scss
   @use 'styles/colors';
   @use 'styles/mixins' as mx;
   ```

2. The extension will provide completion suggestions when you type after a namespace followed by `.` or after `@`:
   当你输入命名空间后跟着 `.` 或在 `@` 后输入时，扩展会自动提供补全建议：
   ```scss
   // Using default namespace / 使用默认命名空间
   colors.$primary-color

   // Using alias / 使用别名
   mx.$large-screen
   ```

## Supported Syntax / 支持的语法

- Basic import / 基本导入：`@use 'path/to/file'`
- Import with alias / 带别名导入：`@use 'path/to/file' as alias`
- Supports relative and absolute paths / 支持相对路径和绝对路径
- Automatically recognizes the following file formats / 自动识别以下文件格式：
  - .scss
  - _index.scss (directory default file / 目录默认文件)

## Completion Information / 补全建议信息

Completion suggestions show / 补全建议会显示：
- Namespace name / 命名空间名称
- Original import path / 原始导入路径
- Alias information (if used) / 别名信息（如果使用了别名）

## Requirements / 系统要求

- VS Code version 1.74.0 or higher / VS Code 版本 1.74.0 或更高
- SCSS files in your workspace / 工作区中包含 SCSS 文件

## Installation / 安装

Search for "SCSS Namespace Support" in the VS Code Extension Marketplace and install.

在 VS Code 扩展市场中搜索 "SCSS Namespace Support" 并安装。

## Extension Settings / 扩展设置

No additional configuration needed, works out of the box.

目前该扩展不需要任何额外配置，安装后即可使用。

## Known Issues / 已知问题

None at the moment. / 暂无已知问题

## Release Notes / 更新日志

### 0.0.1

Initial release / 初始版本发布:
- Basic namespace completion support / 实现基本的命名空间自动补全功能
- Support for @use statement parsing / 支持 @use 语句解析
- Support for alias syntax / 支持别名语法

## Contributing / 贡献

Contributions are welcome! Please feel free to submit Issues and Pull Requests to our [GitHub repository](https://github.com/Jasonw372/scss-namespace-support).

欢迎提交 Issue 和 Pull Request 到我们的 [GitHub 仓库](https://github.com/Jasonw372/scss-namespace-support)。

## License / 许可证

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件。

## Author / 作者

- huanyushi

## Acknowledgments / 致谢

Thanks to all the developers who contributed to this project.

感谢所有为此项目做出贡献的开发者。
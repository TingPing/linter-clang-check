# linter-clang-check

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides an interface to clang-check.
It will be used with files that have the "C++", "C", "Objective-C" and "Objective-C++" syntax.

### Plugin installation

Install from the Settings pane of Atom by searching for and installing the `linter-clang-check` package.

Or install from your Command Prompt by running:
```
$ apm install linter-clang-check
```

## Project-specific settings

### Clang JSON Compilation Database
The [Clang JSON Compilation Database](http://clang.llvm.org/docs/JSONCompilationDatabase.html) is the supported format for project specific settings. You can configure the location of this in settings.

'use babel';

import {Directory} from 'atom';

export default {
  config: {
    execPath: {
      type: 'string',
      default: 'clang-check',
    },
    buildDirectory: {
      type: 'string',
      default: '',
    },
    extraAnalysis: {
      type: 'boolean',
      default: true,
    }
  },

  activate: () => {
    require('atom-package-deps').install('linter-clang-check');
  },

  provideLinter: () => {
    const helpers = require('atom-linter');
    const regex = String.raw`(?<file>.+):(?<line>\d+):(?<col>\d+):({(?<lineStart>\d+):(?<colStart>\d+)-(?<lineEnd>\d+):(?<colEnd>\d+)}.*:)? (?<type>[\w \-]+): (?<message>.*)`;
    return {
      name: 'clang-check',
      grammarScopes: ['source.c', 'source.cpp', 'source.objc', 'source.objcpp'],
      scope: 'file',
      lintOnFly: false,
      lint: (activeEditor) => {
        const command = atom.config.get('linter-clang-check.execPath');
        const file = activeEditor.getPath();
        const args = [];

        // Build path relative to project
        const build_subdir = atom.config.get('linter-clang-check.buildDirectory');
        let builddir;
        if (build_subdir) {
          for (let path of atom.project.getPaths()) {
            const dir = new Directory(path);
            if (dir.contains(file)) {
              builddir = dir.getSubdirectory(build_subdir);
              args.push(`-p=${builddir.getPath()}`);
              break;
            }
          }
        }

        if (atom.config.get('linter-clang-check.extraAnalysis')) {
          args.push('-analyze');
        }

        // The file is added to the arguments last.
        args.push(file);
        const execOpts = {
          stream: 'stderr',
          allowEmptyStderr: true,
        };
        return helpers.exec(command, args, execOpts).then(output => {
          let ret = helpers.parse(output, regex);
          // Convert realtive paths
          if (builddir) {
            for (let entry of ret) {
              if (entry.filePath[0] !== '/') {
                entry.filePath = builddir.getSubdirectory(entry.filePath).getPath();
              }
            }
          }
          return ret;
        });
      },
    };
  },
};

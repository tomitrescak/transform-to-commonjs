const stringLiteral = `"[^"\\\\]*(?:\\\\.[^"\\\\]*)*"|'[^\'\\\\]*(?:\\\\.[^\'\\\\]*)*'`;
const importReg = new RegExp(`^import\\s+((\\* as )?\\s*([\\w_]+)\\s*)?,?\\s*(\\{\\s*([\\w_,\\s]*)\\s\\})?\\s*(from\\s+)?(${stringLiteral})`, 'gm');
const exportRef = /^export\s+(default)?\s*(const|let|var|class|function|interface)?\s*([\w_]*)/mg;

export default function transform(source: string) {
  importReg.lastIndex = 0;

  // handle exports
  const moduleExports: string[] = [];
  let defaultExport: string = null;

  exportRef.lastIndex = 0;
  let match: RegExpExecArray = null;
  while ((match = exportRef.exec(source)) != null) {
    if (match[1]) {
      if (defaultExport) {
        console.error('Multiple default exports!');
        throw new Error('Multiple default exports');
      } else {
        defaultExport = match[3];
      }
    } else {
      moduleExports.push(match[3]);
    }
  }

  // remove export statements
  source = source.replace(/^export\s+(default)?\s*(function\s*\(|\{|\()?\s*/gm, (full: string, defaultKw: string, type: string) => {
    // console.log(type);
    if (type) {
      if (type.match(/function\s/)) {
        defaultExport = 'defaultFunction';
        return 'function defaultFunction(';
      } else if (type.match(/\{/)) {
        defaultExport = 'defaultObject';
        return 'const defaultObject = {';
      } else if (type.match(/\(/)) {
        defaultExport = 'defaultFunction';
        return 'const defaultFunction = (';
      }
    }
    return '';
  });

  // construct exports
  let allExports = '';
  if (moduleExports.length) {
    // append export statement at the end of the file
    moduleExports.forEach((e) => { allExports += `\nexports.${e} = ${e};` });
  }
  if (defaultExport) {
    allExports += `\nexports.default = ${defaultExport};`;
  }

  source += allExports;

  // handle imports
  return source.replace(importReg,
    (wholeMatch: string,
      defaultImport: string,
      defaultAs: string,
      defaultAsVar: string,
      specificImportWrapper: string,
      specificImports: string,
      fromKeyword: string,
      source: string) => {

      if (!fromKeyword) {
        return `require(${source})`;
      }
      else if (defaultImport && specificImports) {
        return handleDefaultImports(defaultAs, defaultAsVar, defaultImport, source) + 
               '\n' +
               handleSpecificImports(specificImports, source);
      }
      else if (defaultImport) {
        return handleDefaultImports(defaultAs, defaultAsVar, defaultImport, source);
      } else if (specificImports) {
        return handleSpecificImports(specificImports, source);
      }
      return wholeMatch;
    });
}

function handleSpecificImports(specificImports: string, source: string) {
  specificImports = specificImports.replace(/ as /g, ': ');
  return `const { ${specificImports} } = require(${source})`;
}

function handleDefaultImports(defaultAs: string, defaultAsVar: string, defaultImport: string, source: string) {
  if (defaultAs) {
    return `const ${defaultAsVar.trim()} = require(${source})`;
  } else {
    return `const ${defaultImport.trim()} = require(${source}).default || require(${source})`;
  }
}
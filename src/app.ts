import type { LanguageId } from './register';
import type { ScopeName, TextMateGrammar, ScopeNameInfo } from './providers';
import { defaultOptions } from './monaco/options';
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { createOnigScanner, createOnigString, loadWASM } from 'vscode-oniguruma';
// import { loadWASM/* , OnigRegExp, OnigScanner, IOnigSearchResult, IOnigMatch, OnigString */ } from 'onigasm';
import * as oni from 'vscode-oniguruma/release/onig.wasm';
import { SimpleLanguageInfoProvider } from './providers';
import { registerLanguages } from './register';
import { rehydrateRegexps } from './configuration';
import VsCodeDarkTheme from './vs-dark-plus-theme';
import pythonSample01 from '!!raw-loader!../sample-files/python_sample_01.py';

interface DemoScopeNameInfo extends ScopeNameInfo {
    path: string;
}

main('python');

async function main(language: LanguageId) {
    // In this demo, the following values are hardcoded to support Python using
    // the VS Code Dark+ theme. Currently, end users are responsible for
    // extracting the data from the relevant VS Code extensions themselves to
    // leverage other TextMate grammars or themes. Scripts may be provided to
    // facilitate this in the future.
    //
    // Note that adding a new TextMate grammar entails the following:
    // - adding an entry in the languages array
    // - adding an entry in the grammars map
    // - making the TextMate file available in the grammars/ folder
    // - making the monaco.languages.LanguageConfiguration available in the
    //   configurations/ folder.
    //
    // You likely also want to add an entry in getSampleCodeForLanguage() and
    // change the call to main() above to pass your LanguageId.
    const languages: monaco.languages.ILanguageExtensionPoint[] = [
        {
            id: 'python',
            extensions: ['.py', '.rpy', '.pyw', '.cpy', '.gyp', '.gypi', '.pyi', '.ipy', '.bzl', '.cconf', '.cinc', '.mcconf', '.sky', '.td', '.tw'],
            aliases: ['Python', 'py'],
            filenames: ['Snakefile', 'BUILD', 'BUCK', 'TARGETS'],
            firstLine: '^#!\\s*/?.*\\bpython[0-9.-]*\\b',
        },
    ];

    const grammars: { [scopeName: string]: DemoScopeNameInfo } = {
        'source.python': {
            language: 'python',
            path: 'MagicPython.tmLanguage.json',
        },
    };

    const fetchGrammar = async (scopeName: ScopeName): Promise<TextMateGrammar> => {
        const { path } = grammars[scopeName];
        const uri = `/grammars/${path}`;
        const response = await fetch(uri);
        const grammar = await response.text();
        const type = path.endsWith('.json') ? 'json' : 'plist';

        return { type, grammar };
    };

    const fetchConfiguration = async (language: LanguageId, ): Promise<monaco.languages.LanguageConfiguration> => {
        const uri = `/configurations/${language}.json`;
        const response = await fetch(uri);
        const rawConfiguration = await response.text();

        return rehydrateRegexps(rawConfiguration);
    };

    // const data: ArrayBuffer | Response = await loadVSCodeOnigurumWASM();

    await loadWASM(oni);

    const onigLib = Promise.resolve({
        createOnigScanner,
        createOnigString,
    });

    const provider = new SimpleLanguageInfoProvider({
        grammars,
        fetchGrammar,
        configurations: languages.map((language) => language.id),
        fetchConfiguration,
        theme: VsCodeDarkTheme,
        onigLib,
        monaco,
    });

    registerLanguages(languages, (language: LanguageId) => provider.fetchLanguageInfo(language), monaco);

    const value = getSampleCodeForLanguage(language);

    let editor = createEditor({ options: { language, value } });

    provider.injectCSS();
}

function createEditor({ options = {} }: { options: monaco.editor.IEditorOptions | monaco.editor.IDiffEditorOptions | monaco.editor.IStandaloneEditorConstructionOptions }): monaco.editor.IStandaloneCodeEditor {
    options = Object.assign(defaultOptions(), options);

    const id = 'container';
    const element = document.getElementById(id);

    if (element == null) {
        throw Error(`could not find element #${id}`);
    }

    let editor = monaco.editor.create(element, options);

    return editor;
}

function getSampleCodeForLanguage(language: LanguageId): string {
    if (language === 'python') {
        return pythonSample01
    }

    throw Error(`unsupported language: ${language}`);
}

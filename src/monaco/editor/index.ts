import { Registry, StackElement, INITIAL } from 'monaco-textmate'
import * as monacoNsps from 'monaco-editor'
import { TMToMonacoToken } from './tm-to-monaco-token';

class TokenizerState implements monacoNsps.languages.IState {

    constructor(private _ruleStack: StackElement) { }

    public get ruleStack(): StackElement {
        return this._ruleStack
    }

    public clone(): TokenizerState {
        return new TokenizerState(this._ruleStack);
    }

    public equals(other: monacoNsps.languages.IState): boolean {
        if (!other || !(other instanceof TokenizerState) || other !== this || other._ruleStack !== this._ruleStack) {
            return false;
        }

        return true;
    }
}

/**
 * Wires up monaco-editor with monaco-textmate
 *
 * @param monaco monaco namespace this operation should apply to (usually the `monaco` global unless you have some other setup)
 * @param registry TmGrammar `Registry` this wiring should rely on to provide the grammars
 * @param languages `Map` of language ids (string) to TM names (string)
 */
export function wireTmGrammars(monaco: typeof monacoNsps, registry: Registry, languages: Map<string, string>, editor?: monacoNsps.editor.ICodeEditor) {
    return Promise.all(
        Array.from(languages.keys())
            .map(async (languageId) => {
                const grammar = await registry.loadGrammar(languages.get(languageId))

                monaco.languages.setTokensProvider(languageId, {
                    getInitialState: () => new TokenizerState(INITIAL),

                    tokenize: (line: string, state: TokenizerState) => {
                        const res = grammar.tokenizeLine(line, state.ruleStack)

                        return {
                            endState: new TokenizerState(res.ruleStack),

                            tokens: res.tokens.map(token => ({
                                ...token,

                                // TODO: At the moment, monaco-editor doesn't seem to accept array of scopes
                                scopes: editor ? TMToMonacoToken(editor, token.scopes) : token.scopes[token.scopes.length - 1]
                            })),
                        }
                    }
                })
            })
    )
}


import { loadWASM } from 'onigasm' // peer dependency of 'monaco-textmate'
// import { Registry } from 'monaco-textmate' // peer dependency
// import { wireTmGrammars } from 'monaco-editor-textmate'

// export async function liftOff() {
//     await loadWASM(`/node_modules/onigasm/lib/onigasm.wasm`); // See https://www.npmjs.com/package/onigasm#light-it-up

//     const registry = new Registry({
//         getGrammarDefinition: async (scopeName) => {
//             return {
//                 format: 'json',
//                 content: await (await fetch(`static/grammars/css.tmGrammar.json`)).text()
//             }
//         }
//     })

//     // map of monaco "language id's" to TextMate scopeNames
//     const grammars = new Map();

//     grammars.set('css', 'source.css');
//     grammars.set('html', 'text.html.basic');
//     grammars.set('typescript', 'source.ts');
//     grammars.set('python', 'source.python');

//     // monaco's built-in themes aren't powereful enough to handle TM tokens
//     // https://github.com/Nishkalkashyap/monaco-vscode-textmate-theme-converter#monaco-vscode-textmate-theme-converter
//     monaco.editor.defineTheme('vs-code-theme-converted', {
//         // ... use `monaco-vscode-textmate-theme-converter` to convert vs code theme and pass the parsed object here
//     });

//     var editor = monaco.editor.create(document.getElementById('container'), {
//         value: [
//             'html, body {',
//             '    margin: 0;',
//             '}'
//         ].join('\n'),
//         language: 'css', // this won't work out of the box, see below for more info,
//         theme: 'vs-code-theme-converted' // very important, see comment above
//     })

//     await wireTmGrammars(monaco, registry, grammars, editor)
// }

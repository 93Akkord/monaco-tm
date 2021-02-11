// <reference path='./../../node_modules/monaco-editor/monaco.d.ts' />

import * as monaco from 'monaco-editor';

/**
 *
 *
 * @author Michael Barros <michaelcbarros@gmail.com>
 * @param {boolean} [isDiff=false]
 * @return {monaco.editor.IEditorOptions | monaco.editor.IDiffEditorOptions | monaco.editor.IStandaloneEditorConstructionOptions}
 */
export function defaultOptions(isDiff: boolean = false): monaco.editor.IEditorOptions | monaco.editor.IDiffEditorOptions | monaco.editor.IStandaloneEditorConstructionOptions {
    let defaultOptions: monaco.editor.IEditorOptions | monaco.editor.IDiffEditorOptions | monaco.editor.IStandaloneEditorConstructionOptions = {
        theme: 'vs-dark', // 'akkdTheme',
        insertSpaces: true,
        tabSize: 4,
        folding: isDiff ? false : true,
        showFoldingControls: 'always',
        renderLineHighlight: 'all',
        roundedSelection: false,
        fontSize: 11,
        wordWrap: 'off', // false,
        minimap: {
            enabled: false,
        },
        mouseWheelZoom: true,
        cursorBlinking: 'smooth',
        scrollBeyondLastLine: true,
        smoothScrolling: true,
        cursorWidth: 1,
        stopRenderingLineAfter: -1,
        showUnused: true,
        contextmenu: true,
        occurrencesHighlight: true,
        selectionHighlight: true,
        hover: {
            enabled: true
        },
        automaticLayout: true,
        cursorSurroundingLines: 5,
        // scrol

        // #region Suggestions

        wordBasedSuggestions: true,
        quickSuggestions: {
            other: true,
            comments: false,
            strings: false,
        },
        suggestSelection: 'first',
        suggest: {
            localityBonus: true,
            filterGraceful: true,
            shareSuggestSelections: true,

            // showWords: true,
            // showIcons: true,
            // showMethods: true,
            // showFunctions: true,
            // showConstructors: true,
            // showFields: true,
            // showVariables: true,
            // showClasses: true,
            // showStructs: true,
            // showInterfaces: true,
            // showModules: true,
            // showProperties: true,
            // showEvents: true,
            // showOperators: true,
            // showUnits: true,
            // showValues: true,
            // showConstants: true,
            // showEnums: true,
            // showEnumMembers: true,
            // showKeywords: true,
            // showColors: true,
            // showFiles: true,
            // showReferences: true,
            // showFolders: true,
            // showTypeParameters: true,
            // showSnippets: true,
        },
        snippetSuggestions: 'inline',

        // #endregion Suggestions
    };

    return defaultOptions;
}

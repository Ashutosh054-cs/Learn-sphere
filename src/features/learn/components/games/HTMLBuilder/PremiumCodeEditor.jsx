import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, RotateCcw, Copy, Check, Settings, 
  Monitor, Smartphone, Tablet, Maximize2, Minimize2,
  Sun, Moon, ZoomIn, ZoomOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import FrostedCard from '../../../../../components/ui/FrostedCard';

/**
 * Premium Monaco Editor Component - LeetCode Quality
 * 
 * Features:
 * - Monaco Editor with IntelliSense
 * - Syntax highlighting & error detection
 * - Auto-complete & bracket matching
 * - Resizable split panes
 * - Live HTML preview
 * - Dark/Light theme toggle
 * - Font size controls
 * - Keyboard shortcuts
 * - Mobile responsive
 * - Comprehensive error handling
 * - Proper cleanup to prevent memory leaks
 */

export default function PremiumCodeEditor({ 
  code, 
  onChange, 
  onSubmit, 
  onReset,
  validationResult,
  language = 'html',
  previewContent = null  // Custom preview HTML (for non-HTML languages)
}) {
  // Editor state
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [fontSize, setFontSize] = useState(14);
  const [splitRatio, setSplitRatio] = useState(65); // Editor width %
  const [isResizing, setIsResizing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Preview state
  const [previewMode, setPreviewMode] = useState('desktop'); // desktop, tablet, mobile
  const [showPreview, setShowPreview] = useState(true);
  
  const editorRef = useRef(null);
  const containerRef = useRef(null);
  const resizeStartX = useRef(0);
  const resizeStartRatio = useRef(50);
  const completionProviderRef = useRef(null);

  // Cleanup Monaco Editor on unmount to prevent disposal errors
  useEffect(() => {
    return () => {
      // Dispose completion provider
      if (completionProviderRef.current) {
        completionProviderRef.current.dispose();
        completionProviderRef.current = null;
      }
      // Dispose editor
      if (editorRef.current) {
        try {
          editorRef.current.dispose();
        } catch (e) {
          // Editor already disposed, ignore
        }
        editorRef.current = null;
      }
    };
  }, []);

  /**
   * Handle Monaco editor mount
   */
  const handleEditorMount = useCallback((editor, monaco) => {
    if (!editor || !monaco) return;
    
    editorRef.current = editor;

    // Configure editor options
    editor.updateOptions({
      fontSize: fontSize,
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
      fontLigatures: true,
      minimap: { enabled: window.innerWidth > 768 },
      scrollBeyondLastLine: false,
      renderWhitespace: 'selection',
      bracketPairColorization: { enabled: true },
      guides: {
        bracketPairs: true,
        indentation: true
      },
      suggest: {
        snippetsPreventQuickSuggestions: false
      },
      quickSuggestions: {
        other: true,
        comments: false,
        strings: true
      },
      autoClosingBrackets: 'always',
      autoClosingTags: true,
      formatOnPaste: true,
      formatOnType: true
    });

    // Add keyboard shortcuts
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      onSubmit?.();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyR, () => {
      onReset?.();
    });

    // Add custom HTML snippets (only if not already registered)
    if (!completionProviderRef.current && language === 'html') {
      completionProviderRef.current = monaco.languages.registerCompletionItemProvider('html', {
        provideCompletionItems: () => {
          return {
            suggestions: [
              {
                label: 'html5',
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertText: [
                  '<!DOCTYPE html>',
                  "<html lang=\"en\">",
                  '<head>',
                  '  <meta charset="UTF-8">',
                  '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
                  "  <title>${1:Document}</title>",
                  '</head>',
                  '<body>',
                  '  $0',
                  '</body>',
                  '</html>'
                ].join('\n'),
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                documentation: 'HTML5 template'
              }
            ]
          };
        }
      });
    }
  }, [fontSize, onSubmit, onReset, language]);

  /**
   * Handle resize drag
   */
  const handleResizeStart = useCallback((e) => {
    setIsResizing(true);
    resizeStartX.current = e.clientX;
    resizeStartRatio.current = splitRatio;
    e.preventDefault();
  }, [splitRatio]);

  const handleResizeMove = useCallback((e) => {
    if (!isResizing || !containerRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = e.clientX - resizeStartX.current;
    const deltaPercent = (deltaX / containerWidth) * 100;
    const newRatio = Math.min(Math.max(resizeStartRatio.current + deltaPercent, 40), 80);
    
    setSplitRatio(newRatio);
  }, [isResizing]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  /**
   * Copy code to clipboard
   */
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, [code]);

  /**
   * Format code
   */
  const handleFormat = useCallback(() => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument').run();
    }
  }, []);

  /**
   * Toggle theme
   */
  const toggleTheme = useCallback(() => {
    setEditorTheme(prev => prev === 'vs-dark' ? 'vs-light' : 'vs-dark');
  }, []);

  /**
   * Adjust font size
   */
  const adjustFontSize = useCallback((delta) => {
    setFontSize(prev => {
      const newSize = Math.min(Math.max(prev + delta, 10), 24);
      if (editorRef.current) {
        editorRef.current.updateOptions({ fontSize: newSize });
      }
      return newSize;
    });
  }, []);

  /**
   * Preview dimensions based on mode
   */
  const previewDimensions = {
    desktop: { width: '100%', maxWidth: 'none' },
    tablet: { width: '768px', maxWidth: '100%' },
    mobile: { width: '375px', maxWidth: '100%' }
  };

  return (
    <div ref={containerRef} className="relative">
      <FrostedCard className="p-0 overflow-hidden">
        {/* Control Bar */}
        <div 
          className="px-4 py-3 border-b flex items-center justify-between flex-wrap gap-3"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)'
          }}
        >
          {/* Left controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onSubmit}
              className="px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 transition-all"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: 'white',
                boxShadow: '0 2px 8px rgba(0, 230, 230, 0.3)'
              }}
            >
              <Play size={16} />
              Run Code
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onReset}
              className="px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-color)'
              }}
            >
              <RotateCcw size={16} />
              Reset
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className="px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all"
              style={{
                backgroundColor: copied ? 'var(--game-easy)' : 'var(--bg-primary)',
                color: copied ? 'white' : 'var(--text-primary)',
                border: `1px solid ${copied ? 'var(--game-easy)' : 'var(--border-color)'}`
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </motion.button>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Theme toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)'
              }}
              title="Toggle theme"
            >
              {editorTheme === 'vs-dark' ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>

            {/* Font size controls */}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ backgroundColor: 'var(--bg-primary)' }}>
              <button
                onClick={() => adjustFontSize(-2)}
                className="p-1 hover:bg-opacity-80 rounded transition-all"
                title="Decrease font size"
              >
                <ZoomOut size={16} style={{ color: 'var(--text-secondary)' }} />
              </button>
              <span className="text-xs font-mono px-2" style={{ color: 'var(--text-primary)' }}>
                {fontSize}px
              </span>
              <button
                onClick={() => adjustFontSize(2)}
                className="p-1 hover:bg-opacity-80 rounded transition-all"
                title="Increase font size"
              >
                <ZoomIn size={16} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            {/* Settings */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: showSettings ? 'var(--accent-primary)' : 'var(--bg-primary)',
                color: showSettings ? 'white' : 'var(--text-primary)'
              }}
              title="Settings"
            >
              <Settings size={18} />
            </motion.button>
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="px-4 py-3 border-b"
            style={{
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-primary)'
            }}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div>
                <label className="block mb-1" style={{ color: 'var(--text-secondary)' }}>Language</label>
                <select 
                  className="w-full px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)'
                  }}
                  value={language}
                  disabled
                >
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="javascript">JavaScript</option>
                </select>
              </div>
              
              <div>
                <label className="block mb-1" style={{ color: 'var(--text-secondary)' }}>Tab Size</label>
                <select 
                  className="w-full px-3 py-2 rounded-lg"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)'
                  }}
                  onChange={(e) => {
                    if (editorRef.current) {
                      editorRef.current.updateOptions({ tabSize: parseInt(e.target.value) });
                    }
                  }}
                >
                  <option value="2">2 spaces</option>
                  <option value="4">4 spaces</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleFormat}
                  className="w-full px-3 py-2 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: 'var(--accent-secondary)',
                    color: 'white'
                  }}
                >
                  Format Code
                </button>
              </div>

              <div className="flex items-end">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full px-3 py-2 rounded-lg font-medium transition-all"
                  style={{
                    backgroundColor: showPreview ? 'var(--game-easy)' : 'var(--bg-secondary)',
                    color: showPreview ? 'white' : 'var(--text-primary)',
                    border: `1px solid ${showPreview ? 'var(--game-easy)' : 'var(--border-color)'}`
                  }}
                >
                  {showPreview ? 'Hide' : 'Show'} Preview
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Editor + Preview Split View */}
        <div className="flex flex-col lg:flex-row" style={{ height: '450px' }}>
          {/* Monaco Editor Panel */}
          <motion.div
            className="relative"
            style={{
              width: showPreview ? `${splitRatio}%` : '100%',
              minWidth: showPreview ? '400px' : 'auto',
              transition: isResizing ? 'none' : 'width 0.3s ease'
            }}
          >
            <Editor
              height="100%"
              language={language}
              value={code || ''}
              onChange={(value) => {
                if (onChange && typeof onChange === 'function') {
                  onChange(value || '');
                }
              }}
              onMount={handleEditorMount}
              theme={editorTheme}
              options={{
                automaticLayout: true,
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto',
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10
                }
              }}
            />

            {/* Validation overlay */}
            {validationResult && !validationResult.isValid && (
              <div 
                className="absolute bottom-0 left-0 right-0 px-4 py-2 text-xs flex items-center gap-2"
                style={{ 
                  backgroundColor: 'rgba(239, 68, 68, 0.95)',
                  color: 'white'
                }}
              >
                <span>❌</span>
                <span>{validationResult?.errors?.length || 0} error(s) found</span>
              </div>
            )}
          </motion.div>

          {/* Resize Handle */}
          {showPreview && (
            <div
              onMouseDown={handleResizeStart}
              className="hidden lg:block cursor-col-resize hover:bg-opacity-100 transition-all group"
              style={{
                width: '8px',
                backgroundColor: isResizing ? 'var(--accent-primary)' : 'var(--border-primary)',
                cursor: 'col-resize',
                position: 'relative'
              }}
            >
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-0.5">
                  <div className="w-0.5 h-8 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  <div className="w-0.5 h-8 rounded-full" style={{ backgroundColor: 'var(--accent-primary)' }} />
                </div>
              </div>
            </div>
          )}

          {/* Preview Panel */}
          {showPreview && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col bg-white"
              style={{
                minWidth: '300px'
              }}
            >
              {/* Preview controls */}
              <div className="px-4 py-2 border-b flex items-center justify-between bg-gray-50">
                <div className="flex gap-2">
                  {[
                    { mode: 'desktop', icon: Monitor },
                    { mode: 'tablet', icon: Tablet },
                    { mode: 'mobile', icon: Smartphone }
                  ].map(({ mode, icon: Icon }) => (
                    <button
                      key={mode}
                      onClick={() => setPreviewMode(mode)}
                      className="p-2 rounded-lg transition-all"
                      style={{
                        backgroundColor: previewMode === mode ? 'var(--accent-primary)' : 'transparent',
                        color: previewMode === mode ? 'white' : '#64748b'
                      }}
                      title={mode}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
                
                <span className="text-xs font-medium text-gray-600">
                  Live Preview
                </span>
              </div>

              {/* Preview content */}
              <div className="flex-1 overflow-auto p-4 bg-gray-50">
                <div 
                  className="mx-auto bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300"
                  style={previewDimensions[previewMode]}
                >
                  <iframe
                    key={`preview-${Date.now()}`}
                    srcDoc={previewContent || `
                      <!DOCTYPE html>
                      <html>
                        <head>
                          <meta charset="UTF-8">
                          <meta name="viewport" content="width=device-width, initial-scale=1.0">
                          <style>
                            body { 
                              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                              margin: 20px;
                              line-height: 1.6;
                            }
                            * { box-sizing: border-box; }
                          </style>
                        </head>
                        <body>${code || ''}</body>
                      </html>
                    `}
                    sandbox="allow-same-origin allow-scripts"
                    className="w-full border-0"
                    style={{ height: '400px' }}
                    title="Preview"
                    onError={(e) => {
                      console.warn('Preview iframe error:', e);
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Status Bar */}
        <div 
          className="px-4 py-2 text-xs flex items-center justify-between border-t"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'var(--border-primary)',
            color: 'var(--text-secondary)'
          }}
        >
          <div className="flex gap-4">
            <span>Language: {language.toUpperCase()}</span>
            <span>Lines: {(code || '').split('\n').length}</span>
            <span>Chars: {(code || '').length}</span>
          </div>
          
          <div className="flex gap-3 text-xs">
            <span>
              <kbd className="px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>Ctrl+S</kbd> Submit
            </span>
            <span>
              <kbd className="px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--bg-primary)' }}>Ctrl+R</kbd> Reset
            </span>
          </div>
        </div>
      </FrostedCard>
    </div>
  );
}

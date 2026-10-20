import React, { useState } from 'react';
import { JAVA_SOURCE_FILES, JvmLogEntry } from '../utils/javaCode';
import { Copy, Check, Download, Terminal, X, FileCode } from 'lucide-react';

interface JavaInspectorProps {
  isOpen: boolean;
  onClose: () => void;
  jvmLogs: JvmLogEntry[];
}

export const JavaInspector: React.FC<JavaInspectorProps> = ({
  isOpen,
  onClose,
  jvmLogs,
}) => {
  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'code' | 'logs'>('code');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = JAVA_SOURCE_FILES[selectedFileIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([currentFile.code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = currentFile.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-40 w-full sm:w-[540px] md:w-[620px] bg-slate-900/98 border-l border-slate-800 shadow-2xl flex flex-col text-slate-200">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-mono text-xs font-bold">
            ☕
          </div>
          <div>
            <h3 className="font-display font-semibold text-sm text-slate-100 flex items-center gap-2">
              Java Engine Studio
              <span className="text-[11px] font-mono text-amber-400 font-normal">JDK 21</span>
            </h3>
            <p className="text-xs text-slate-400">Object-Oriented Architecture & JVM Stream</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          title="Close Inspector"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'code'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            Source Files ({JAVA_SOURCE_FILES.length})
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1.5 transition-colors ${
              activeTab === 'logs'
                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            Live JVM Logs ({jvmLogs.length})
          </button>
        </div>

        {activeTab === 'code' && (
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700/60 flex items-center gap-1 transition-colors"
              title="Copy current Java file"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-2.5 py-1 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 hover:text-white rounded border border-slate-700/60 flex items-center gap-1 transition-colors"
              title="Download .java file"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'code' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* File List Selector */}
            <div className="flex items-center gap-1 px-3 py-2 overflow-x-auto border-b border-slate-800/80 bg-slate-950/40 no-scrollbar">
              {JAVA_SOURCE_FILES.map((file, idx) => (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFileIdx(idx)}
                  className={`px-2.5 py-1 text-xs font-mono rounded whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    selectedFileIdx === idx
                      ? 'bg-slate-800 text-amber-300 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
                  }`}
                >
                  <span className="text-amber-500">☕</span>
                  {file.filename}
                </button>
              ))}
            </div>

            {/* File Info Bar */}
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>{currentFile.description}</span>
              <span className="font-mono text-[11px] text-slate-500">
                {currentFile.code.split('\n').length} lines
              </span>
            </div>

            {/* Syntax Highlighted Code Area */}
            <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs leading-relaxed text-slate-300 select-text">
              <pre className="whitespace-pre">
                <code>{currentFile.code}</code>
              </pre>
            </div>

            {/* Compilation instructions kicker */}
            <div className="p-3 bg-slate-900 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span className="text-slate-500">Local Run:</span>
              <span className="text-amber-400/90 select-all">javac {currentFile.filename} &amp;&amp; java {currentFile.className}</span>
            </div>
          </div>
        ) : (
          /* Live JVM Execution Logs */
          <div className="flex-1 flex flex-col overflow-hidden bg-slate-950 font-mono text-xs">
            <div className="p-2.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live JVM stdout Stream
              </span>
              <span className="text-[11px] text-slate-500">Updates on every move &amp; AI evaluation</span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2 select-text">
              {jvmLogs.length === 0 ? (
                <div className="text-slate-600 italic py-8 text-center">
                  Play a move on the board to watch live JVM execution traces...
                </div>
              ) : (
                jvmLogs.map((log) => (
                  <div key={log.id} className="leading-snug">
                    <span className="text-slate-600 text-[11px] mr-2">[{log.timestamp}]</span>
                    {log.type === 'ai' && <span className="text-purple-400 font-semibold">[MinimaxAI] </span>}
                    {log.type === 'info' && <span className="text-cyan-400 font-semibold">[Board] </span>}
                    {log.type === 'jvm' && <span className="text-amber-400 font-semibold">[JVM] </span>}
                    {log.type === 'win' && <span className="text-emerald-400 font-semibold">[VICTORY] </span>}
                    {log.type === 'event' && <span className="text-rose-400 font-semibold">[RULE] </span>}
                    <span className="text-slate-300">{log.message}</span>
                    {log.sourceMethod && (
                      <span className="text-slate-600 text-[10px] block pl-6">
                        ↳ at {log.sourceMethod}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

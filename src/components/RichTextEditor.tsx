import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Smile, 
  Link, 
  Image, 
  AlignLeft, 
  AlignCenter, 
  AlignRight 
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content...",
  className = ""
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState<number>(0);

  const emojis = ['😊', '😂', '🤔', '👍', '👎', '❤️', '🎉', '🚀', '💡', '⚡', '🔥', '💯'];

  // Save cursor position
  const saveCursorPosition = () => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(editorRef.current);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        setCursorPosition(preCaretRange.toString().length);
      }
    }
  };

  // Restore cursor position
  const restoreCursorPosition = () => {
    if (editorRef.current && cursorPosition >= 0) {
      const selection = window.getSelection();
      const range = document.createRange();
      let charIndex = 0;
      let found = false;

      const traverseNodes = (node: Node) => {
        if (found) return;

        if (node.nodeType === Node.TEXT_NODE) {
          const nextCharIndex = charIndex + node.textContent!.length;
          if (cursorPosition >= charIndex && cursorPosition <= nextCharIndex) {
            range.setStart(node, cursorPosition - charIndex);
            range.setEnd(node, cursorPosition - charIndex);
            found = true;
            return;
          }
          charIndex = nextCharIndex;
        } else {
          for (let i = 0; i < node.childNodes.length; i++) {
            traverseNodes(node.childNodes[i]);
            if (found) return;
          }
        }
      };

      traverseNodes(editorRef.current);
      
      if (found) {
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    updateContent();
  };

  const updateContent = () => {
    if (editorRef.current) {
      saveCursorPosition();
      onChange(editorRef.current.innerHTML);
    }
  };

  // Restore cursor after content update
  useEffect(() => {
    if (editorRef.current) {
      restoreCursorPosition();
    }
  }, [value]);

  const insertEmoji = (emoji: string) => {
    if (editorRef.current) {
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      if (range) {
        range.deleteContents();
        range.insertNode(document.createTextNode(emoji));
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      updateContent();
      setShowEmojiPicker(false);
    }
  };

  const insertLink = () => {
    // Get selected text to pre-fill link text
    const selection = window.getSelection();
    const selectedText = selection?.toString() || '';
    setLinkText(selectedText);
    setLinkUrl('');
    setShowLinkModal(true);
  };

  const handleInsertLink = () => {
    if (linkUrl.trim()) {
      // If there's selected text, use it as link text, otherwise use the URL
      const linkTextToUse = linkText.trim() || linkUrl.trim();
      
      // Create a temporary element to build the link HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = `<a href="${linkUrl.trim()}" target="_blank" rel="noopener noreferrer">${linkTextToUse}</a>`;
      
      // Insert the link at cursor position
      if (editorRef.current) {
        const selection = window.getSelection();
        const range = selection?.getRangeAt(0);
        if (range) {
          range.deleteContents();
          range.insertNode(tempDiv.firstChild!);
          range.collapse(false);
          selection?.removeAllRanges();
          selection?.addRange(range);
        }
        updateContent();
      }
      
      setShowLinkModal(false);
      setLinkUrl('');
      setLinkText('');
    }
  };

  const handleCancelLink = () => {
    setShowLinkModal(false);
    setLinkUrl('');
    setLinkText('');
  };

  const insertImage = () => {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      
      if (file) {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('Image file size must be less than 5MB');
          return;
        }
        
        // Create a FileReader to convert file to data URL
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataUrl = event.target?.result as string;
          if (dataUrl) {
            execCommand('insertImage', dataUrl);
          }
        };
        reader.readAsDataURL(file);
      }
      
      // Clean up the file input
      document.body.removeChild(fileInput);
    };
    
    // Add file input to DOM and trigger click
    document.body.appendChild(fileInput);
    fileInput.click();
  };

  const handleInput = () => {
    updateContent();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ensure cursor moves properly on arrow keys
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      setTimeout(() => saveCursorPosition(), 0);
    }
  };

  const handleClick = () => {
    setTimeout(() => saveCursorPosition(), 0);
  };

  const handleFocus = () => {
    // Ensure the editor is focused and cursor is at the end if no selection
    if (editorRef.current) {
      editorRef.current.focus();
      if (!cursorPosition) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(editorRef.current);
        range.collapse(false); // Move to end
        selection?.removeAllRanges();
        selection?.addRange(range);
        saveCursorPosition();
      }
    }
  };

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => execCommand('bold')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('italic')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('strikeThrough')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => execCommand('insertUnorderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('insertOrderedList')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={() => execCommand('justifyLeft')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('justifyCenter')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={() => execCommand('justifyRight')}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </button>

        <div className="w-px bg-gray-300 mx-1"></div>

        <button
          type="button"
          onClick={insertLink}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Link"
        >
          <Link className="h-4 w-4" />
        </button>
        
        <button
          type="button"
          onClick={insertImage}
          className="p-2 hover:bg-gray-200 rounded transition-colors"
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 hover:bg-gray-200 rounded transition-colors"
            title="Insert Emoji"
          >
            <Smile className="h-4 w-4" />
          </button>
          
          {showEmojiPicker && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 z-10 grid grid-cols-6 gap-3 w-80">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertEmoji(emoji)}
                  className="p-3 hover:bg-gray-100 rounded-lg text-2xl transition-colors"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-[90vw]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Insert Link</h3>
              <button
                onClick={handleCancelLink}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL
                </label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  autoFocus
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link Text (optional)
                </label>
                <input
                  type="text"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Display text for the link"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use the URL as display text
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 mt-6">
              <button
                onClick={handleCancelLink}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleInsertLink}
                disabled={!linkUrl.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Insert Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        dangerouslySetInnerHTML={{ __html: value }}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        onFocus={handleFocus}
        className="p-4 min-h-[200px] focus:outline-none prose max-w-none"
        style={{ 
          maxWidth: 'none',
          direction: 'ltr',
          textAlign: 'left',
          unicodeBidi: 'embed'
        }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty::before {
          content: attr(data-placeholder);
          color: #9CA3AF;
          pointer-events: none;
          direction: ltr;
          text-align: left;
        }
        
        [contenteditable] {
          direction: ltr !important;
          text-align: left !important;
        }
        
        [contenteditable] * {
          direction: ltr !important;
          text-align: left !important;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;
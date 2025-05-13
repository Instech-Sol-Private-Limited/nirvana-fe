import React, {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  RefObject,
} from 'react';
import Quill, { TextChangeHandler, SelectionChangeHandler } from 'quill';

interface EditorProps {
  readOnly: boolean;
  defaultValue?: any; // You can replace `any` with Quill's Delta type if needed
  onTextChange?: TextChangeHandler;
  onSelectionChange?: SelectionChangeHandler;
}

const TextEditor = forwardRef<Quill | null, EditorProps>(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      if (ref && typeof ref !== 'function') {
        ref.current?.enable?.(!readOnly);
      }
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const editorContainer = container.ownerDocument.createElement('div');
      container.appendChild(editorContainer);

      const quill = new Quill(editorContainer, {
        theme: 'snow',
      });

      if (ref && typeof ref !== 'function') {
        ref.current = quill;
      }

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on('text-change', (...args) => {
        onTextChangeRef.current?.(...args);
      });

      quill.on('selection-change', (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        if (ref && typeof ref !== 'function') {
          ref.current = null;
        }
        container.innerHTML = '';
      };
    }, [ref]);

    return <div ref={containerRef}></div>;
  },
);

TextEditor.displayName = 'Editor';

export default TextEditor;

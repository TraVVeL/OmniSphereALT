import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Commands from "./suggestion/commands";
import getSuggestionItems from "./suggestion/Items";
import renderItems from "./suggestion/renderItems";

const logMessage = (val) => {
  console.log(`show / hide the image upload modal`);
};

const TextEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Commands.configure({
        suggestion: {
          items: getSuggestionItems,
          render: renderItems
        }
      })
    ],
    content: "<p>Use / command to see different options</p> "
  });

  return <EditorContent editor={editor} className="editor" />;
};

export default TextEditor;

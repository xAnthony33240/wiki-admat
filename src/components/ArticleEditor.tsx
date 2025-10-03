import React, { useState } from 'react';
import { Article, Category } from '../types';
import { 
  Save, 
  ArrowLeft, 
  Bold, 
  Italic, 
  List, 
  Image as ImageIcon, 
  Link, 
  Code, 
  AlertTriangle, 
  Heading1, 
  Heading2, 
  Heading3, 
  CheckSquare,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Video as VideoIcon,
  Upload,
  CornerDownLeft
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link2 from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import Table2 from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TextAlign from '@tiptap/extension-text-align';
import { Video } from '../extensions/Video';
import { FileUpload } from './FileUpload';

interface ArticleEditorProps {
  article: Article;
  categories: Category[];
  isNew?: boolean;
  onSave: (updatedArticle: Article) => void;
  onCancel: () => void;
}

export function ArticleEditor({ article, categories, isNew = false, onSave, onCancel }: ArticleEditorProps) {
  const [formData, setFormData] = useState<Article>(article);
  const [selectedCategory, setSelectedCategory] = useState(article.category);
  const [showFileUpload, setShowFileUpload] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
        paragraph: {
          HTMLAttributes: {
            class: 'min-h-[1.5em]', // Hauteur minimale pour les paragraphes vides
          },
        }
      }),
      Image,
      Link2.configure({
        openOnClick: false,
      }),
      CodeBlock,
      Highlight.configure({
        multicolor: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Placeholder.configure({
        placeholder: 'Commencez à écrire votre contenu ici...',
      }),
      Table2.configure({
        resizable: true,
      }),
      TableRow,
      TableCell,
      TableHeader,
      TextAlign.configure({
        types: ['heading', 'paragraph', 'tableCell', 'tableHeader'],
      }),
      Video,
    ],
    content: formData.content || '',
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert max-w-none focus:outline-none min-h-[200px] text-gray-900 dark:text-gray-100',
        style: 'white-space: pre-wrap;', // Préserve les espaces et sauts de ligne
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editor) {
      onSave({
        ...formData,
        category: selectedCategory,
        content: editor.getHTML(),
        updatedAt: new Date()
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addImage = () => {
    const url = window.prompt('URL de l\'image:');
    if (url && editor) {
      // Insérer à la position du curseur sans remplacer
      const { from } = editor.state.selection;
      editor.chain().focus().insertContentAt(from, [
        {
          type: 'paragraph',
          content: []
        },
        {
          type: 'image',
          attrs: { src: url }
        },
        {
          type: 'paragraph',
          content: []
        }
      ]).run();
    }
  };

  const addVideo = () => {
    const url = window.prompt('URL de la vidéo:');
    if (url && editor) {
      // Insérer à la position du curseur sans remplacer
      const { from } = editor.state.selection;
      editor.chain().focus().insertContentAt(from, [
        {
          type: 'paragraph',
          content: []
        },
        {
          type: 'video',
          attrs: { src: url }
        },
        {
          type: 'paragraph',
          content: []
        }
      ]).run();
    }
  };

  const handleFileUploaded = (url: string, type: 'image' | 'video') => {
    if (editor) {
      // Insérer à la position du curseur sans remplacer
      const { from } = editor.state.selection;
      if (type === 'image') {
        editor.chain().focus().insertContentAt(from, [
          {
            type: 'paragraph',
            content: []
          },
          {
            type: 'image',
            attrs: { src: url }
          },
          {
            type: 'paragraph',
            content: []
          }
        ]).run();
      } else {
        editor.chain().focus().insertContentAt(from, [
          {
            type: 'paragraph',
            content: []
          },
          {
            type: 'video',
            attrs: { src: url }
          },
          {
            type: 'paragraph',
            content: []
          }
        ]).run();
      }
    }
    setShowFileUpload(false);
  };

  const addLink = () => {
    const url = window.prompt('URL du lien:');
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addWarning = () => {
    if (editor) {
      editor.chain().focus().toggleNode('blockquote', 'paragraph').run();
      editor.chain().focus().toggleHighlight({ color: '#fff3cd' }).run();
    }
  };

  const addTable = () => {
    if (editor) {
      editor.chain()
        .focus()
        .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
        .run();
    }
  };

  const addLineBreak = () => {
    if (editor) {
      editor.chain().focus().setHardBreak().run();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onCancel}
          className="flex items-center text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {isNew ? 'Nouvel Article' : 'Éditer l\'article'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titre */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Titre
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        {/* Catégorie */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Catégorie
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Contenu avec éditeur riche */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Contenu
          </label>
          <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden">
            {/* Barre d'outils */}
            <div className="flex flex-wrap items-center gap-2 p-2 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  editor?.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
                title="Gras"
              >
                <Bold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  editor?.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
                title="Italique"
              >
                <Italic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  editor?.isActive('heading', { level: 1 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
                title="Titre 1"
              >
                <Heading1 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
                title="Titre 2"
              >
                <Heading2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  editor?.isActive('heading', { level: 3 }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
                title="Titre 3"
              >
                <Heading3 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  editor?.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
                title="Liste à puces"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleTaskList().run()}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  editor?.isActive('taskList') ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
                title="Liste de tâches"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => editor?.chain().focus().toggleCodeBlock().run()}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  editor?.isActive('codeBlock') ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
                title="Bloc de code"
              >
                <Code className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={addImage}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Insérer une image (URL)"
              >
                <ImageIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={addVideo}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Insérer une vidéo (URL)"
              >
                <VideoIcon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowFileUpload(!showFileUpload)}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  showFileUpload ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
                title="Upload fichier (image/vidéo)"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={addLink}
                className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                  editor?.isActive('link') ? 'bg-gray-200 dark:bg-gray-600' : ''
                }`}
                title="Insérer un lien"
              >
                <Link className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={addWarning}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Ajouter un avertissement"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={addTable}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Insérer un tableau"
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={addLineBreak}
                className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                title="Saut de ligne"
              >
                <CornerDownLeft className="w-4 h-4" />
              </button>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    editor?.isActive({ textAlign: 'left' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                  }`}
                  title="Aligner à gauche"
                >
                  <AlignLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    editor?.isActive({ textAlign: 'center' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                  }`}
                  title="Centrer"
                >
                  <AlignCenter className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  className={`p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-600 ${
                    editor?.isActive({ textAlign: 'right' }) ? 'bg-gray-200 dark:bg-gray-600' : ''
                  }`}
                  title="Aligner à droite"
                >
                  <AlignRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            {/* Upload de fichiers */}
            {showFileUpload && (
              <div className="p-4 border-b border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                <FileUpload onFileUploaded={handleFileUploaded} />
              </div>
            )}
            {/* Éditeur */}
            <div className="p-4">
              <EditorContent editor={editor} />
            </div>
          </div>
        </div>

        {/* Auteur */}
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Auteur
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            required
          />
        </div>

        {/* Boutons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="flex items-center px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
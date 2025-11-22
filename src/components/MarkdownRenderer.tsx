import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  filename: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ filename }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Ensure filename ends with .md
        const filePath = filename.endsWith('.md') ? filename : `${filename}.md`;
        
        // Fetch from public/content directory
        const response = await fetch(`/content/${filePath}`);
        
        if (!response.ok) {
          throw new Error(`Failed to load ${filePath}: ${response.statusText}`);
        }
        
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load markdown file');
        console.error('Error loading markdown:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMarkdown();
  }, [filename]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-brand-charcoal">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h2 className="text-red-800 font-semibold mb-2">Error loading content</h2>
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-4xl font-bold mb-6 text-brand-charcoal" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-3xl font-bold mb-4 mt-8 text-brand-charcoal" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-2xl font-semibold mb-3 mt-6 text-brand-charcoal" {...props} />,
          p: ({ node, ...props }) => <p className="mb-4 text-brand-charcoal leading-relaxed" {...props} />,
          a: ({ node, ...props }) => <a className="text-brand-ltPurple hover:text-brand-dkPurple underline" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2" {...props} />,
          li: ({ node, ...props }) => <li className="text-brand-charcoal" {...props} />,
          blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-brand-ltPurple pl-4 italic my-4" {...props} />,
          code: ({ node, inline, ...props }) => 
            inline ? (
              <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props} />
            ) : (
              <code className="block bg-gray-100 p-4 rounded overflow-x-auto" {...props} />
            ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;


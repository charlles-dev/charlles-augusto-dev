import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from content
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    const headingElements = tempDiv.querySelectorAll('h1, h2, h3');
    const extractedHeadings: Heading[] = [];

    headingElements.forEach((heading) => {
      const level = parseInt(heading.tagName.charAt(1));
      const text = heading.textContent || '';
      const id = heading.id || text.toLowerCase().replace(/\s+/g, '-');
      
      if (!heading.id) {
        heading.id = id;
      }
      
      extractedHeadings.push({ id, text, level });
    });

    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <Card className="sticky top-24 hidden lg:block">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <List className="h-4 w-4" />
          Table of Contents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <nav className="space-y-1">
          {headings.map(({ id, text, level }) => (
            <button
              key={id}
              onClick={() => handleClick(id)}
              className={cn(
                'block w-full text-left text-sm hover:text-primary transition-colors py-1',
                level === 2 && 'pl-4',
                level === 3 && 'pl-8',
                activeId === id ? 'text-primary font-medium' : 'text-muted-foreground'
              )}
            >
              {text}
            </button>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
};

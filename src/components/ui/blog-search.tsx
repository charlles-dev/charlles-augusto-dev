import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Search, Filter, X } from 'lucide-react';

interface BlogSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  categories?: string[];
  tags?: string[];
}

export interface SearchFilters {
  category?: string;
  tags: string[];
  sortBy: 'recent' | 'popular' | 'relevant';
}

export const BlogSearch = ({ onSearch, categories = [], tags = [] }: BlogSearchProps) => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    tags: [],
    sortBy: 'recent',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearch = () => {
    onSearch(query, filters);
  };

  const addTag = (tag: string) => {
    if (!filters.tags.includes(tag)) {
      const newFilters = { ...filters, tags: [...filters.tags, tag] };
      setFilters(newFilters);
      onSearch(query, newFilters);
    }
  };

  const removeTag = (tag: string) => {
    const newFilters = { ...filters, tags: filters.tags.filter(t => t !== tag) };
    setFilters(newFilters);
    onSearch(query, newFilters);
  };

  const clearFilters = () => {
    setFilters({ tags: [], sortBy: 'recent' });
    setQuery('');
    onSearch('', { tags: [], sortBy: 'recent' });
  };

  const hasActiveFilters = filters.category || filters.tags.length > 0 || filters.sortBy !== 'recent';

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value, filters);
            }}
            className="pl-10"
          />
        </div>
        <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {hasActiveFilters && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-primary" />
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Category</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={!filters.category ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => {
                      const newFilters = { ...filters, category: undefined };
                      setFilters(newFilters);
                      onSearch(query, newFilters);
                    }}
                  >
                    All
                  </Badge>
                  {categories.map((category) => (
                    <Badge
                      key={category}
                      variant={filters.category === category ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        const newFilters = { ...filters, category };
                        setFilters(newFilters);
                        onSearch(query, newFilters);
                      }}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              {tags.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={filters.tags.includes(tag) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => {
                          if (filters.tags.includes(tag)) {
                            removeTag(tag);
                          } else {
                            addTag(tag);
                          }
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Sort By</h4>
                <div className="flex flex-wrap gap-2">
                  {(['recent', 'popular', 'relevant'] as const).map((sort) => (
                    <Badge
                      key={sort}
                      variant={filters.sortBy === sort ? 'default' : 'outline'}
                      className="cursor-pointer capitalize"
                      onClick={() => {
                        const newFilters = { ...filters, sortBy: sort };
                        setFilters(newFilters);
                        onSearch(query, newFilters);
                      }}
                    >
                      {sort}
                    </Badge>
                  ))}
                </div>
              </div>

              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearFilters}
                  className="w-full"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {(filters.category || filters.tags.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {filters.category && (
            <Badge variant="secondary" className="gap-1">
              Category: {filters.category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => {
                  const newFilters = { ...filters, category: undefined };
                  setFilters(newFilters);
                  onSearch(query, newFilters);
                }}
              />
            </Badge>
          )}
          {filters.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              {tag}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => removeTag(tag)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

"use client";

import { RefObject, useState, useEffect, useRef } from 'react';
import { Search, Command, FileText, Users, Settings, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypeaheadSearchProps {
  inputRef: RefObject<HTMLInputElement | null>;
}

interface SearchResult {
  id: string;
  title: string;
  description?: string;
  url: string;
  category: 'pages' | 'users' | 'files' | 'commands';
  icon?: React.ComponentType<{ className?: string }>;
}

// Mock data - replace with your actual search data
const searchData: SearchResult[] = [
  { id: '1', title: 'Dashboard', description: 'Main dashboard page', url: '/dashboard', category: 'pages', icon: Calendar },
  { id: '2', title: 'Account Settings', description: 'Manage your account', url: '/account', category: 'pages', icon: Settings },
  { id: '3', title: 'User Management', description: 'Manage users', url: '/users', category: 'pages', icon: Users },
  { id: '4', title: 'Documents', description: 'File management', url: '/documents', category: 'files', icon: FileText },
  { id: '5', title: 'Create New Project', description: 'Start a new project', url: '/projects/new', category: 'commands', icon: Command },
  { id: '6', title: 'Export Data', description: 'Export your data', url: '/export', category: 'commands', icon: Command },
];

export default function TypeaheadSearch({ inputRef }: TypeaheadSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Search function
  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filtered.slice(0, 8)); // Limit to 8 results
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
    setIsOpen(true);
    setSelectedIndex(-1);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleResultClick(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef?.current?.blur();
        break;
    }
  };

  // Handle result click
  const handleResultClick = (result: SearchResult) => {
    setQuery(result.title);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    // Navigate to the result URL
    window.location.href = result.url;
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef?.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => document.removeEventListener('keydown', handleKeyboardShortcut);
  }, [inputRef]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'pages': return '📄';
      case 'users': return '👤';
      case 'files': return '📁';
      case 'commands': return '⚡';
      default: return '🔍';
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <span className="absolute -translate-y-1/2 left-4 top-1/2 pointer-events-none">
            <Search className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (query.trim()) {
                setIsOpen(true);
              }
            }}
            placeholder="Search or type command..."
            className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-2 focus:ring-gray-500/20 dark:border-gray-800 dark:bg-gray-900 dark:bg-white/[0.03] dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[430px]"
          />

          <button 
            type="button"
            className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400"
            onClick={() => inputRef?.current?.focus()}
          >
            <span>⌘</span>
            <span>K</span>
          </button>
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="py-2">
            {results.map((result, index) => {
              const Icon = result.icon;
              return (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result)}
                  className={cn(
                    "w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-3 transition-colors",
                    selectedIndex === index && "bg-gray-50 dark:bg-gray-800"
                  )}
                >
                  <div className="flex-shrink-0">
                    {Icon ? (
                      <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    ) : (
                      <span className="text-sm">{getCategoryIcon(result.category)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-white truncate">
                      {result.title}
                    </div>
                    {result.description && (
                      <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {result.description}
                      </div>
                    )}
                  </div>
                  <div className="flex-shrink-0">
                    <span className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                      {result.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && query.trim() && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-50">
          <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No results found for "{query}"</p>
          </div>
        </div>
      )}
    </div>
  );
}
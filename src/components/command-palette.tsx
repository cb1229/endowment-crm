'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Building2, TrendingUp, Building, Briefcase, Home, LayoutDashboard } from 'lucide-react';

interface SearchResult {
  id: string;
  name: string;
  type: 'firm' | 'fund' | 'company' | 'deal';
  href: string;
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Toggle command palette with Cmd+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Search across entities
  const performSearch = useCallback(async (query: string) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const [firmsRes, fundsRes, companiesRes, dealsRes] = await Promise.all([
        fetch(`/api/firms?search=${encodeURIComponent(query)}`),
        fetch(`/api/funds?search=${encodeURIComponent(query)}`),
        fetch(`/api/companies?search=${encodeURIComponent(query)}`),
        fetch(`/api/deals?search=${encodeURIComponent(query)}`),
      ]);

      const [firms, funds, companies, deals] = await Promise.all([
        firmsRes.json(),
        fundsRes.json(),
        companiesRes.json(),
        dealsRes.json(),
      ]);

      const allResults: SearchResult[] = [
        ...firms.slice(0, 5).map((f: any) => ({
          id: f.id,
          name: f.name,
          type: 'firm' as const,
          href: `/firms/${f.id}`,
        })),
        ...funds.slice(0, 5).map((f: any) => ({
          id: f.id,
          name: f.name,
          type: 'fund' as const,
          href: `/funds/${f.id}`,
        })),
        ...companies.slice(0, 5).map((c: any) => ({
          id: c.id,
          name: c.name,
          type: 'company' as const,
          href: `/companies/${c.id}`,
        })),
        ...deals.slice(0, 5).map((d: any) => ({
          id: d.id,
          name: d.name,
          type: 'deal' as const,
          href: `/pipeline`,
        })),
      ];

      setResults(allResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(search);
    }, 200);

    return () => clearTimeout(timer);
  }, [search, performSearch]);

  const handleSelect = (href: string) => {
    setOpen(false);
    setSearch('');
    router.push(href);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'firm':
        return Building2;
      case 'fund':
        return TrendingUp;
      case 'company':
        return Building;
      case 'deal':
        return Briefcase;
      default:
        return Building2;
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput
        placeholder="Search firms, funds, companies, deals..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          {loading ? 'Searching...' : 'No results found.'}
        </CommandEmpty>

        {/* Quick navigation */}
        {!search && (
          <CommandGroup heading="Quick Navigation">
            <CommandItem onSelect={() => handleSelect('/')}>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('/dashboard')}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('/pipeline')}>
              <Briefcase className="mr-2 h-4 w-4" />
              <span>Pipeline</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('/firms')}>
              <Building2 className="mr-2 h-4 w-4" />
              <span>Firms</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('/funds')}>
              <TrendingUp className="mr-2 h-4 w-4" />
              <span>Funds</span>
            </CommandItem>
            <CommandItem onSelect={() => handleSelect('/companies')}>
              <Building className="mr-2 h-4 w-4" />
              <span>Companies</span>
            </CommandItem>
          </CommandGroup>
        )}

        {/* Search results */}
        {search && results.length > 0 && (
          <>
            <CommandSeparator />
            {['firm', 'fund', 'company', 'deal'].map((type) => {
              const items = results.filter((r) => r.type === type);
              if (items.length === 0) return null;

              return (
                <CommandGroup
                  key={type}
                  heading={type.charAt(0).toUpperCase() + type.slice(1) + 's'}
                >
                  {items.map((item) => {
                    const Icon = getIcon(item.type);
                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => handleSelect(item.href)}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <span>{item.name}</span>
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              );
            })}
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}

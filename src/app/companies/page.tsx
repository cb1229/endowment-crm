'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CompanySheet } from '@/components/company-sheet';
import { SearchInput } from '@/components/search-input';
import { PageHeader } from '@/components/page-header';
import Link from 'next/link';

interface Company {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  industry: string | null;
  headquarters: string | null;
  foundedYear: number | null;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCompanies = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/companies');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const query = searchQuery.toLowerCase();
    return (
      company.name.toLowerCase().includes(query) ||
      company.industry?.toLowerCase().includes(query) ||
      company.headquarters?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen">
      <PageHeader
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Companies' }
        ]}
        title="Portfolio Companies"
        description="Monitor portfolio companies and investment prospects"
        actions={
          <Button onClick={() => setSheetOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Company
          </Button>
        }
      />

      <div className="p-6 space-y-6">
        <div className="paper-container p-6">
          {/* Search */}
          <div className="mb-6 max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search companies by name, industry..."
            />
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-sm text-muted-foreground">Loading companies...</div>
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-sm text-muted-foreground">
                {searchQuery ? 'No companies match your search' : 'No companies found'}
              </p>
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="font-medium">Name</TableHead>
                    <TableHead className="font-medium">Industry</TableHead>
                    <TableHead className="font-medium">Headquarters</TableHead>
                    <TableHead className="font-medium">Founded</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompanies.map((company) => (
                    <TableRow key={company.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell>
                        <Link href={`/companies/${company.id}`} className="flex items-center gap-3 font-medium">
                          <div className="avatar avatar-sm">
                            {company.name.substring(0, 2).toUpperCase()}
                          </div>
                          {company.name}
                        </Link>
                      </TableCell>
                      <TableCell>
                        {company.industry ? (
                          <Badge variant="outline" className="text-xs rounded-full badge-green">
                            {company.industry}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {company.headquarters || '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {company.foundedYear || '—'}
                      </TableCell>
                      <TableCell>
                        {company.website && (
                          <a
                            href={company.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <CompanySheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={fetchCompanies}
      />
    </div>
  );
}

'use client';

import { CATEGORY_ORDER, allLabel, categoryLabel } from '@/lib/categories';
import type { Category, LanguageCode } from '@/lib/types';

interface CategoryTabsProps {
  language: LanguageCode;
  active: Category | 'all';
  available: Category[];
  onChange: (category: Category | 'all') => void;
}

export function CategoryTabs({ language, active, available, onChange }: CategoryTabsProps) {
  const availableSet = new Set(available);
  const categories = CATEGORY_ORDER.filter((c) => availableSet.has(c));

  return (
    <nav aria-label="Category" className="-mx-1 overflow-x-auto">
      <ul className="flex min-w-max items-center gap-3 px-1 text-sm">
        <CategoryItem
          label={allLabel(language)}
          isActive={active === 'all'}
          onClick={() => onChange('all')}
        />
        {categories.map((category) => (
          <CategoryItem
            key={category}
            label={categoryLabel(category, language)}
            isActive={active === category}
            onClick={() => onChange(category)}
          />
        ))}
      </ul>
    </nav>
  );
}

function CategoryItem({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        aria-current={isActive ? 'true' : undefined}
        className={[
          'whitespace-nowrap font-bold underline',
          isActive ? 'text-accent' : 'text-ink-muted visited:text-ink-muted hover:text-accent',
        ].join(' ')}
      >
        [&nbsp;{label}&nbsp;]
      </button>
    </li>
  );
}

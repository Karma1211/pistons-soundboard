'use client';

import { Category, CATEGORIES } from '@/lib/sounds';

interface Props {
  active: Category;
  onChange: (cat: Category) => void;
}

export function CategoryTabs({ active, onChange }: Props) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      {CATEGORIES.map((cat) => {
        const isActive = active === cat.id;
        return (
          <button
            key={cat.id}
            onClick={() => onChange(cat.id)}
            className={[
              'flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-lg',
              'text-xs font-black tracking-widest uppercase transition-all duration-150',
              isActive
                ? 'bg-[#C8102E] text-white shadow-[0_2px_12px_rgba(200,16,46,0.5)]'
                : 'bg-[#1e1e1e] text-[#888] hover:bg-[#2a2a2a] hover:text-white',
            ].join(' ')}
          >
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}

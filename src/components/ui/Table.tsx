import React, { ReactNode } from 'react';
import { FiChevronDown, FiChevronUp, FiChevronRight } from 'react-icons/fi';

export interface TableColumn<T> {
  key: string;
  header: string | ReactNode;
  render?: (row: T, index: number) => ReactNode;
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  keyExtractor: (item: T) => string;
  className?: string;
  loading?: boolean;
  loadingText?: string;
  emptyText?: string;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  bordered?: boolean;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (column: string) => void;
  onRowClick?: (item: T) => void;
  selected?: string | null;
  expandable?: boolean;
  renderExpandedRow?: (item: T) => ReactNode;
}

function Table<T>({
  data,
  columns,
  keyExtractor,
  className = '',
  loading = false,
  loadingText = 'Loading...',
  emptyText = 'No data available',
  striped = true,
  hoverable = true,
  compact = false,
  bordered = false,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  selected,
  expandable = false,
  renderExpandedRow
}: TableProps<T>) {
  const [expandedRows, setExpandedRows] = React.useState<Record<string, boolean>>({});

  // Toggle row expansion
  const toggleRowExpansion = (key: string) => {
    setExpandedRows(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Get cell align class
  const getCellAlignClass = (align?: 'left' | 'center' | 'right') => {
    switch (align) {
      case 'center':
        return 'text-center';
      case 'right':
        return 'text-right';
      default:
        return 'text-left';
    }
  };

  // Handle sort click
  const handleSortClick = (column: TableColumn<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  // Get sort icon
  const getSortIcon = (column: TableColumn<T>) => {
    if (!column.sortable) return null;
    
    if (sortColumn === column.key) {
      return sortDirection === 'asc' ? <FiChevronUp className="ml-1 h-4 w-4" /> : <FiChevronDown className="ml-1 h-4 w-4" />;
    }
    
    return null;
  };

  // Handle row click
  const handleRowClick = (item: T) => {
    if (onRowClick) {
      onRowClick(item);
    }
  };

  // Table style classes
  const tableClasses = `min-w-full divide-y divide-gray-200 ${bordered ? 'border border-gray-200' : ''} ${className}`;
  const thClasses = `px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider ${compact ? 'py-2' : ''}`;
  const tdClasses = `px-6 ${compact ? 'py-2' : 'py-4'} whitespace-nowrap text-sm text-gray-500`;
  const trClasses = `${hoverable ? 'hover:bg-gray-50' : ''} ${onRowClick ? 'cursor-pointer' : ''}`;
  const stripedClasses = striped ? 'bg-white even:bg-gray-50' : 'bg-white';
  const selectedClasses = 'bg-primary-50 hover:bg-primary-100';

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className={tableClasses}>
        <thead className="bg-gray-50">
          <tr>
            {expandable && (
              <th className={`${thClasses} w-10`}></th>
            )}
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${thClasses} ${getCellAlignClass(column.align)}`}
                style={{ width: column.width }}
                onClick={() => handleSortClick(column)}
              >
                <div className={`flex items-center ${column.sortable ? 'cursor-pointer' : ''} ${column.align === 'right' ? 'justify-end' : column.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                  {column.header}
                  {getSortIcon(column)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td
                colSpan={expandable ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                <div className="flex justify-center items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {loadingText}
                </div>
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={expandable ? columns.length + 1 : columns.length}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => {
              const key = keyExtractor(item);
              const isExpanded = expandedRows[key];
              const isSelected = selected === key;
              
              return (
                <React.Fragment key={key}>
                  <tr 
                    className={`${trClasses} ${stripedClasses} ${isSelected ? selectedClasses : ''}`}
                    onClick={() => handleRowClick(item)}
                  >
                    {expandable && (
                      <td className={tdClasses} onClick={(e) => { e.stopPropagation(); toggleRowExpansion(key); }}>
                        <div className="flex justify-center">
                          <button className="focus:outline-none">
                            <FiChevronRight className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'transform rotate-90' : ''}`} />
                          </button>
                        </div>
                      </td>
                    )}
                    {columns.map((column) => (
                      <td 
                        key={`${key}-${column.key}`}
                        className={`${tdClasses} ${getCellAlignClass(column.align)}`}
                      >
                        {column.render ? column.render(item, rowIndex) : (item as any)[column.key]}
                      </td>
                    ))}
                  </tr>
                  {expandable && isExpanded && renderExpandedRow && (
                    <tr>
                      <td colSpan={columns.length + 1} className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                        {renderExpandedRow(item)}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
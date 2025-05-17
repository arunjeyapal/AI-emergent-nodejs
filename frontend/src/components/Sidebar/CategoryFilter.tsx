import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../redux/store';
import { toggleCategory, selectAllCategories, deselectAllCategories } from '../../redux/categorySlice';

const CategoryFilter: React.FC = () => {
  const dispatch = useDispatch();
  const { categories, selectedCategories } = useSelector((state: RootState) => state.categories);

  const handleToggle = (categoryId: string) => {
    dispatch(toggleCategory(categoryId));
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-700">Categories</h3>
        <div className="flex space-x-2">
          <button 
            onClick={() => dispatch(selectAllCategories())}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            All
          </button>
          <button 
            onClick={() => dispatch(deselectAllCategories())}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            None
          </button>
        </div>
      </div>
      <div className="space-y-2">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center">
            <input
              type="checkbox"
              id={`category-${category.id}`}
              checked={selectedCategories.includes(category.id)}
              onChange={() => handleToggle(category.id)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label 
              htmlFor={`category-${category.id}`}
              className="ml-2 text-sm text-gray-700 flex items-center"
            >
              <span 
                className="w-3 h-3 rounded-full mr-2" 
                style={{ backgroundColor: category.color }}
              ></span>
              {category.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

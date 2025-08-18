Frontend Migrator Setup Guide
1. Install Required Dependencies
First, install the necessary dependencies for the migrator:

cd "/home/admin/000code/interface getFlytoo"
npm init -y
npm install @babel/parser @babel/traverse @babel/generator commander
2. Example Component for Project B (Source)
Create this file manually at examples/my-react-app-B/src/components/Button.jsx:

import React from 'react';
import './Button.css';

/**
 * Button component from Project B
 * This will be migrated to Project A
 */
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  className = ''
}) => {
  const baseClasses = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const disabledClass = disabled ? 'btn--disabled' : '';
  
  const buttonClasses = [
    baseClasses,
    variantClass,
    sizeClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      data-testid="custom-button"
    >
      {children}
    </button>
  );
};

export default Button;
3. CSS File for Button Component
Create examples/my-react-app-B/src/components/Button.css:

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn--primary {
  background-color: #007bff;
  color: white;
}

.btn--secondary {
  background-color: #6c757d;
  color: white;
}

.btn--small {
  padding: 4px 8px;
  font-size: 12px;
}

.btn--medium {
  padding: 8px 16px;
  font-size: 14px;
}

.btn--large {
  padding: 12px 24px;
  font-size: 16px;
}

.btn--disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn:hover:not(.btn--disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}
4. Modal Component Example
Create examples/my-react-app-B/src/components/Modal.jsx:

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './Modal.css';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium',
  closeOnOverlayClick = true 
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className={`modal-content modal-content--${size}`}>
        <div className="modal-header">
          <h2 className="modal-title">{title}</h2>
          <button 
            className="modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
5. Test the Migration
Once you've created these example files, you can test the migration:

# Run the migration
node swap-frontend.js --source "./examples/my-react-app-B" --target "./examples/my-react-app-A" --generate-tests

# Or run in dry-run mode first
node swap-frontend.js --source "./examples/my-react-app-B" --target "./examples/my-react-app-A" --dry-run
6. Expected Output
After running the migration, you should see:

Migrated components in examples/my-react-app-A/src/components_migrated_from_B/
Generated test files in examples/my-react-app-A/src/components_migrated_from_B/__tests__/
Console output showing the migration progress and any warnings
7. Package.json for Dependencies
Create a package.json in the root directory:

{
  "name": "frontend-migrator",
  "version": "1.0.0",
  "description": "Frontend component migration tool",
  "main": "swap-frontend.js",
  "dependencies": {
    "@babel/parser": "^7.23.0",
    "@babel/traverse": "^7.23.0",
    "@babel/generator": "^7.23.0",
    "commander": "^11.0.0"
  },
  "scripts": {
    "migrate": "node swap-frontend.js",
    "test-migration": "node swap-frontend.js --source ./examples/my-react-app-B --target ./examples/my-react-app-A --generate-tests"
  }
}



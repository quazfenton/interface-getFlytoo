import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import VisualEditor from './visual_editor_components';
import './index.css';
// Minimal initial project data for testing
const initialProject = {
    files: {
        'src/App.jsx': `
import React from 'react';

function App() {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Hello from Migrated App!</h1>
      <p>This is a test component.</p>
      <button style={{ backgroundColor: 'blue', color: 'white', padding: '10px 20px', borderRadius: '5px' }}>Click Me</button>
    </div>
  );
}

export default App;
`,
    },
    framework: 'react',
    name: 'Test Project',
};
const App = () => {
    return (_jsx(React.StrictMode, { children: _jsx(VisualEditor, { initialProject: initialProject }) }));
};
const rootElement = document.getElementById('root');
if (rootElement) {
    ReactDOM.createRoot(rootElement).render(_jsx(App, {}));
}
else {
    console.error('Root element not found');
}

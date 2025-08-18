"use client";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Textarea } from './ui/textarea';
import { Eye, Code, Layers, Package, Settings, Save, Undo, Redo, MousePointer, Move, Square, Type, Image, Upload, Play, RefreshCw, AlertCircle, Info, X, Zap, Smartphone, Monitor, Tablet, Paintbrush, Layout, Component, Database, Globe, Trash2, MoreHorizontal, ChevronDown, ChevronRight, FileText, Plus, Search, ArrowRight, Link, Lock, Unlock } from 'lucide-react';
// Placeholder for SelectionOverlay - assuming it's a component that needs to be imported or defined
// For now, providing a minimal definition to resolve type errors.
const SelectionOverlay = (props) => {
    return (_jsx("div", { className: "absolute inset-0 pointer-events-none" }));
};
// Enhanced Component Library Panel
const ComponentLibraryPanel = ({ framework, onComponentDrop }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedCategories, setExpandedCategories] = useState(new Set(['basic']));
    const componentCategories = {
        basic: {
            name: 'Basic Elements',
            icon: Square,
            components: [
                { type: 'div', name: 'Container', icon: Square, description: 'Basic container element' },
                { type: 'button', name: 'Button', icon: MousePointer, description: 'Interactive button' },
                { type: 'input', name: 'Input', icon: Type, description: 'Text input field' },
                { type: 'textarea', name: 'Textarea', icon: Type, description: 'Multi-line text input' },
                { type: 'img', name: 'Image', icon: Image, description: 'Image element' },
                { type: 'text', name: 'Text', icon: Type, description: 'Text element' },
                { type: 'link', name: 'Link', icon: Link, description: 'Hyperlink element' }
            ]
        },
        layout: {
            name: 'Layout',
            icon: Layout,
            components: [
                { type: 'header', name: 'Header', icon: Layout, description: 'Page header' },
                { type: 'nav', name: 'Navigation', icon: Layout, description: 'Navigation menu' },
                { type: 'main', name: 'Main', icon: Layout, description: 'Main content area' },
                { type: 'aside', name: 'Sidebar', icon: Layout, description: 'Sidebar content' },
                { type: 'footer', name: 'Footer', icon: Layout, description: 'Page footer' },
                { type: 'section', name: 'Section', icon: Layout, description: 'Content section' },
                { type: 'article', name: 'Article', icon: FileText, description: 'Article content' }
            ]
        },
        forms: {
            name: 'Form Elements',
            icon: FileText,
            components: [
                { type: 'form', name: 'Form', icon: FileText, description: 'Form container' },
                { type: 'select', name: 'Select', icon: ChevronDown, description: 'Dropdown select' },
                { type: 'checkbox', name: 'Checkbox', icon: Square, description: 'Checkbox input' },
                { type: 'radio', name: 'Radio', icon: Square, description: 'Radio button' },
                { type: 'range', name: 'Slider', icon: ArrowRight, description: 'Range slider' },
                { type: 'file', name: 'File Upload', icon: Upload, description: 'File upload input' }
            ]
        },
        media: {
            name: 'Media',
            icon: Image,
            components: [
                { type: 'video', name: 'Video', icon: Play, description: 'Video player' },
                { type: 'audio', name: 'Audio', icon: Play, description: 'Audio player' },
                { type: 'canvas', name: 'Canvas', icon: Paintbrush, description: 'Drawing canvas' },
                { type: 'svg', name: 'SVG', icon: Paintbrush, description: 'SVG graphics' },
                { type: 'iframe', name: 'Iframe', icon: Globe, description: 'Embedded content' }
            ]
        },
        advanced: {
            name: 'Advanced',
            icon: Zap,
            components: framework === 'react' ? [
                { type: 'react-component', name: 'Custom Component', icon: Component, description: 'Custom React component' },
                { type: 'react-hook', name: 'Hook Component', icon: Zap, description: 'Component with hooks' },
                { type: 'react-context', name: 'Context Provider', icon: Database, description: 'Context provider' },
                { type: 'react-portal', name: 'Portal', icon: Globe, description: 'React portal' }
            ] : framework === 'vue' ? [
                { type: 'vue-component', name: 'Vue Component', icon: Component, description: 'Custom Vue component' },
                { type: 'vue-directive', name: 'Directive', icon: Zap, description: 'Vue directive' },
                { type: 'vue-slot', name: 'Slot', icon: Square, description: 'Vue slot' }
            ] : [
                { type: 'web-component', name: 'Web Component', icon: Component, description: 'Custom web component' },
                { type: 'custom-element', name: 'Custom Element', icon: Zap, description: 'Custom HTML element' }
            ]
        }
    };
    const filteredCategories = Object.entries(componentCategories).reduce((acc, [key, category]) => {
        if (selectedCategory !== 'all' && key !== selectedCategory)
            return acc;
        const filteredComponents = (componentCategories[key]).components.filter(comp => comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            comp.description.toLowerCase().includes(searchTerm.toLowerCase()));
        if (filteredComponents.length > 0) {
            acc[key] = Object.assign(Object.assign({}, category), { components: filteredComponents });
        }
        return acc;
    }, {});
    const toggleCategory = (categoryKey) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryKey)) {
            newExpanded.delete(categoryKey);
        }
        else {
            newExpanded.add(categoryKey);
        }
        setExpandedCategories(newExpanded);
    };
    const handleDragStart = (e, componentType) => {
        e.dataTransfer.setData('component-type', componentType);
        e.dataTransfer.effectAllowed = 'copy';
    };
    return (_jsxs("div", { className: "h-1/2 border-b border-gray-700 flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Components" }), _jsx(Badge, { variant: "outline", className: "text-xs", children: framework })] }), _jsxs("div", { className: "relative mb-3", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), _jsx(Input, { placeholder: "Search components...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 bg-gray-800 border-gray-600 text-white" })] }), _jsxs(Select, { value: selectedCategory, onValueChange: setSelectedCategory, children: [_jsx(SelectTrigger, { className: "bg-gray-800 border-gray-600 text-white", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "all", children: "All Categories" }), Object.entries(componentCategories).map(([key, category]) => (_jsx(SelectItem, { value: key, children: category.name }, key)))] })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-2", children: Object.entries(filteredCategories).map(([categoryKey, category]) => (_jsxs("div", { className: "mb-2", children: [_jsxs("button", { onClick: () => toggleCategory(categoryKey), className: "w-full flex items-center justify-between p-2 text-left text-white hover:bg-gray-700 rounded", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(category.icon, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm font-medium", children: category.name })] }), expandedCategories.has(categoryKey) ?
                                    _jsx(ChevronDown, { className: "w-4 h-4" }) :
                                    _jsx(ChevronRight, { className: "w-4 h-4" })] }), expandedCategories.has(categoryKey) && (_jsx("div", { className: "ml-2 space-y-1", children: category.components.map((component) => (_jsxs("div", { draggable: true, onDragStart: (e) => handleDragStart(e, component.type), className: "flex items-center gap-2 p-2 text-gray-300 hover:bg-gray-700 rounded cursor-move group", title: component.description, children: [_jsx(component.icon, { className: "w-4 h-4 text-gray-400" }), _jsxs("div", { className: "flex-1", children: [_jsx("div", { className: "text-sm", children: component.name }), _jsx("div", { className: "text-xs text-gray-500 group-hover:text-gray-400", children: component.description })] }), _jsx(Plus, { className: "w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" })] }, component.type))) }))] }, categoryKey))) })] }));
};
// Enhanced Property Inspector Panel
const PropertyInspectorPanel = ({ selectedComponents, project, onPropertyChange }) => {
    var _a;
    const [activeTab, setActiveTab] = useState('properties');
    const [expandedSections, setExpandedSections] = useState(new Set(['basic', 'layout']));
    const selectedComponent = selectedComponents.size === 1
        ? (_a = project.visualConfig) === null || _a === void 0 ? void 0 : _a.componentMap.get(Array.from(selectedComponents)[0])
        : null;
    const toggleSection = (section) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(section)) {
            newExpanded.delete(section);
        }
        else {
            newExpanded.add(section);
        }
        setExpandedSections(newExpanded);
    };
    const renderPropertyInput = (property, value, type = 'text') => {
        if (!selectedComponent)
            return null;
        const handleChange = (newValue) => {
            onPropertyChange(selectedComponent.id, property, newValue);
        };
        switch (type) {
            case 'color':
                return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "color", value: value || '#000000', onChange: (e) => handleChange(e.target.value), className: "w-8 h-8 rounded border border-gray-600" }), _jsx(Input, { value: value || '', onChange: (e) => handleChange(e.target.value), className: "flex-1 bg-gray-800 border-gray-600 text-white text-xs", placeholder: "#000000" })] }));
            case 'number':
                return (_jsx(Input, { type: "number", value: value || '', onChange: (e) => handleChange(Number(e.target.value)), className: "bg-gray-800 border-gray-600 text-white text-xs" }));
            case 'select':
                return (_jsxs(Select, { value: value || '', onValueChange: handleChange, children: [_jsx(SelectTrigger, { className: "bg-gray-800 border-gray-600 text-white text-xs", children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "auto", children: "Auto" }), _jsx(SelectItem, { value: "flex", children: "Flex" }), _jsx(SelectItem, { value: "grid", children: "Grid" }), _jsx(SelectItem, { value: "block", children: "Block" }), _jsx(SelectItem, { value: "inline", children: "Inline" })] })] }));
            case 'boolean':
                return (_jsx(Switch, { checked: value || false, onCheckedChange: handleChange }));
            case 'slider':
                return (_jsxs("div", { className: "space-y-2", children: [_jsx(Slider, { value: [value || 0], onValueChange: (values) => handleChange(values[0]), max: 100, step: 1, className: "w-full" }), _jsx("div", { className: "text-xs text-gray-400 text-center", children: value || 0 })] }));
            default:
                return (_jsx(Input, { value: value || '', onChange: (e) => handleChange(e.target.value), className: "bg-gray-800 border-gray-600 text-white text-xs" }));
        }
    };
    const renderPropertiesTab = () => {
        if (!selectedComponent) {
            return (_jsxs("div", { className: "text-center text-gray-400 py-8", children: [_jsx(Settings, { className: "w-12 h-12 mx-auto mb-4 opacity-50" }), _jsx("p", { children: "Select a component to edit properties" })] }));
        }
        const propertySections = {
            basic: {
                name: 'Basic Properties',
                properties: [
                    { key: 'id', label: 'ID', type: 'text' },
                    { key: 'className', label: 'CSS Class', type: 'text' },
                    { key: 'title', label: 'Title', type: 'text' },
                    { key: 'hidden', label: 'Hidden', type: 'boolean' },
                    { key: 'locked', label: 'Locked', type: 'boolean' }
                ]
            },
            layout: {
                name: 'Layout & Position',
                properties: [
                    { key: 'position', label: 'Position', type: 'select' },
                    { key: 'display', label: 'Display', type: 'select' },
                    { key: 'width', label: 'Width', type: 'text' },
                    { key: 'height', label: 'Height', type: 'text' },
                    { key: 'top', label: 'Top', type: 'text' },
                    { key: 'left', label: 'Left', type: 'text' },
                    { key: 'zIndex', label: 'Z-Index', type: 'number' }
                ]
            },
            spacing: {
                name: 'Spacing',
                properties: [
                    { key: 'margin', label: 'Margin', type: 'text' },
                    { key: 'padding', label: 'Padding', type: 'text' },
                    { key: 'gap', label: 'Gap', type: 'text' }
                ]
            },
            typography: {
                name: 'Typography',
                properties: [
                    { key: 'fontSize', label: 'Font Size', type: 'text' },
                    { key: 'fontFamily', label: 'Font Family', type: 'text' },
                    { key: 'fontWeight', label: 'Font Weight', type: 'select' },
                    { key: 'color', label: 'Text Color', type: 'color' },
                    { key: 'textAlign', label: 'Text Align', type: 'select' },
                    { key: 'lineHeight', label: 'Line Height', type: 'text' }
                ]
            },
            background: {
                name: 'Background & Border',
                properties: [
                    { key: 'backgroundColor', label: 'Background Color', type: 'color' },
                    { key: 'backgroundImage', label: 'Background Image', type: 'text' },
                    { key: 'borderColor', label: 'Border Color', type: 'color' },
                    { key: 'borderWidth', label: 'Border Width', type: 'text' },
                    { key: 'borderRadius', label: 'Border Radius', type: 'text' }
                ]
            }
        };
        return (_jsx("div", { className: "space-y-4", children: Object.entries(propertySections).map(([sectionKey, section]) => (_jsxs("div", { className: "border border-gray-700 rounded-lg", children: [_jsxs("button", { onClick: () => toggleSection(sectionKey), className: "w-full flex items-center justify-between p-3 text-left text-white hover:bg-gray-700 rounded-t-lg", children: [_jsx("span", { className: "text-sm font-medium", children: section.name }), expandedSections.has(sectionKey) ?
                                _jsx(ChevronDown, { className: "w-4 h-4" }) :
                                _jsx(ChevronRight, { className: "w-4 h-4" })] }), expandedSections.has(sectionKey) && (_jsx("div", { className: "p-3 space-y-3 border-t border-gray-700", children: section.properties.map((prop) => {
                            var _a, _b;
                            return (_jsxs("div", { className: "space-y-1", children: [_jsx(Label, { className: "text-xs text-gray-300", children: prop.label }), renderPropertyInput(prop.key, ((_a = selectedComponent.styles) === null || _a === void 0 ? void 0 : _a[prop.key]) || ((_b = selectedComponent.props) === null || _b === void 0 ? void 0 : _b[prop.key]), prop.type)] }, prop.key));
                        }) }))] }, sectionKey))) }));
    };
    const renderStylesTab = () => {
        if (!selectedComponent)
            return null;
        return (_jsx("div", { className: "space-y-4", children: _jsxs("div", { className: "border border-gray-700 rounded-lg p-3", children: [_jsx("h4", { className: "text-sm font-medium text-white mb-3", children: "Custom CSS" }), _jsx(Textarea, { value: Object.entries(selectedComponent.styles || {})
                            .map(([key, value]) => `${key}: ${value};`)
                            .join('\n'), onChange: (e) => {
                            // Parse CSS and update styles
                            const styles = {};
                            e.target.value.split('\n').forEach(line => {
                                const [key, value] = line.split(':').map(s => s.trim());
                                if (key && value) {
                                    styles[key] = value.replace(';', '');
                                }
                            });
                            onPropertyChange(selectedComponent.id, 'styles', styles);
                        }, className: "bg-gray-800 border-gray-600 text-white font-mono text-xs", rows: 10, placeholder: "property: value;" })] }) }));
    };
    const renderAnimationsTab = () => {
        var _a;
        if (!selectedComponent)
            return null;
        return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-sm font-medium text-white", children: "Animations" }), _jsxs(Button, { size: "sm", variant: "outline", className: "text-xs", children: [_jsx(Plus, { className: "w-3 h-3 mr-1" }), "Add Animation"] })] }), ((_a = selectedComponent.animations) === null || _a === void 0 ? void 0 : _a.length) ? (selectedComponent.animations.map((animation, index) => (_jsxs("div", { className: "border border-gray-700 rounded-lg p-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("span", { className: "text-sm text-white", children: animation.type }), _jsx(Button, { size: "sm", variant: "ghost", className: "text-red-400 hover:text-red-300", children: _jsx(Trash2, { className: "w-3 h-3" }) })] }), _jsxs("div", { className: "space-y-2 text-xs", children: [_jsxs("div", { children: ["Trigger: ", animation.trigger] }), _jsxs("div", { children: ["Duration: ", animation.duration, "ms"] })] })] }, animation.id)))) : (_jsxs("div", { className: "text-center text-gray-400 py-8", children: [_jsx(Zap, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }), _jsx("p", { className: "text-xs", children: "No animations added" })] }))] }));
    };
    return (_jsxs("div", { className: "h-1/2 flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Properties" }), selectedComponents.size > 0 && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [selectedComponents.size, " selected"] }))] }), _jsx(Tabs, { value: activeTab, onValueChange: (value) => setActiveTab(value), children: _jsxs(TabsList, { className: "grid w-full grid-cols-4 bg-gray-800", children: [_jsx(TabsTrigger, { value: "properties", className: "text-xs", children: "Props" }), _jsx(TabsTrigger, { value: "styles", className: "text-xs", children: "Styles" }), _jsx(TabsTrigger, { value: "animations", className: "text-xs", children: "Animate" }), _jsx(TabsTrigger, { value: "accessibility", className: "text-xs", children: "A11y" })] }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-4", children: _jsxs(Tabs, { value: activeTab, onValueChange: (value) => setActiveTab(value), children: [_jsx(TabsContent, { value: "properties", className: "mt-0", children: renderPropertiesTab() }), _jsx(TabsContent, { value: "styles", className: "mt-0", children: renderStylesTab() }), _jsx(TabsContent, { value: "animations", className: "mt-0", children: renderAnimationsTab() }), _jsx(TabsContent, { value: "accessibility", className: "mt-0", children: _jsxs("div", { className: "text-center text-gray-400 py-8", children: [_jsx(Settings, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }), _jsx("p", { className: "text-xs", children: "Accessibility options coming soon" })] }) })] }) })] }));
};
// Enhanced Layers Panel
const LayersPanel = ({ project, selectedComponents, onSelectionChange, onComponentUpdate }) => {
    var _a;
    const [expandedLayers, setExpandedLayers] = useState(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const toggleLayer = (layerId) => {
        const newExpanded = new Set(expandedLayers);
        if (newExpanded.has(layerId)) {
            newExpanded.delete(layerId);
        }
        else {
            newExpanded.add(layerId);
        }
        setExpandedLayers(newExpanded);
    };
    const components = Array.from(((_a = project.visualConfig) === null || _a === void 0 ? void 0 : _a.componentMap.values()) || []);
    const filteredComponents = components.filter(comp => comp.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        comp.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const handleComponentClick = (componentId, event) => {
        if (event.ctrlKey || event.metaKey) {
            // Multi-select
            const newSelection = new Set(selectedComponents);
            if (newSelection.has(componentId)) {
                newSelection.delete(componentId);
            }
            else {
                newSelection.add(componentId);
            }
            onSelectionChange(new Set([componentId]));
        }
        else {
            onSelectionChange(new Set([componentId]));
        }
    };
    const handleVisibilityToggle = (componentId) => {
        var _a;
        const component = (_a = project.visualConfig) === null || _a === void 0 ? void 0 : _a.componentMap.get(componentId);
        if (component) {
            onComponentUpdate(componentId, { hidden: !component.hidden });
        }
    };
    const handleLockToggle = (componentId) => {
        var _a;
        const component = (_a = project.visualConfig) === null || _a === void 0 ? void 0 : _a.componentMap.get(componentId);
        if (component) {
            onComponentUpdate(componentId, { locked: !component.locked });
        }
    };
    return (_jsxs("div", { className: "h-1/2 border-b border-gray-700 flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Layers" }), _jsx(Badge, { variant: "outline", className: "text-xs", children: filteredComponents.length })] }), _jsxs("div", { className: "relative", children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" }), _jsx(Input, { placeholder: "Search layers...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 bg-gray-800 border-gray-600 text-white text-sm" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-2", children: filteredComponents.length === 0 ? (_jsxs("div", { className: "text-center text-gray-400 py-8", children: [_jsx(Layers, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }), _jsx("p", { className: "text-xs", children: "No components found" })] })) : (_jsx("div", { className: "space-y-1", children: filteredComponents.map((component) => (_jsxs("div", { className: `group flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${selectedComponents.has(component.id)
                            ? 'bg-blue-600/20 border border-blue-500/50'
                            : 'hover:bg-gray-700'}`, onClick: (e) => handleComponentClick(component.id, e), children: [_jsxs("div", { className: "w-4 h-4 flex-shrink-0", children: [component.type === 'react-component' && _jsx(Component, { className: "w-4 h-4 text-blue-400" }), component.type === 'div' && _jsx(Square, { className: "w-4 h-4 text-gray-400" }), component.type === 'button' && _jsx(MousePointer, { className: "w-4 h-4 text-green-400" }), component.type === 'img' && _jsx(Image, { className: "w-4 h-4 text-purple-400" }), !['react-component', 'div', 'button', 'img'].includes(component.type) &&
                                        _jsx(Square, { className: "w-4 h-4 text-gray-400" })] }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm text-white truncate", children: component.type }), _jsx("div", { className: "text-xs text-gray-400 truncate", children: component.id })] }), _jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx(Button, { size: "sm", variant: "ghost", className: "w-6 h-6 p-0", onClick: (e) => {
                                            e.stopPropagation();
                                            handleVisibilityToggle(component.id);
                                        }, title: component.hidden ? "Show" : "Hide", children: component.hidden ?
                                            _jsx(Eye, { className: "w-3 h-3 text-gray-500" }) :
                                            _jsx(Eye, { className: "w-3 h-3 text-white" }) }), _jsx(Button, { size: "sm", variant: "ghost", className: "w-6 h-6 p-0", onClick: (e) => {
                                            e.stopPropagation();
                                            handleLockToggle(component.id);
                                        }, title: component.locked ? "Unlock" : "Lock", children: component.locked ?
                                            _jsx(Lock, { className: "w-3 h-3 text-red-400" }) :
                                            _jsx(Unlock, { className: "w-3 h-3 text-gray-400" }) })] })] }, component.id))) })) })] }));
};
// Enhanced Assets Panel
const AssetsPanel = ({ project, onAssetUpload, onAssetInsert }) => {
    var _a;
    const [activeAssetTab, setActiveAssetTab] = useState('images');
    const fileInputRef = useRef(null);
    const assets = Array.from(((_a = project.visualConfig) === null || _a === void 0 ? void 0 : _a.assets.values()) || []);
    const filteredAssets = assets.filter(asset => {
        switch (activeAssetTab) {
            case 'images': return asset.type === 'image';
            case 'icons': return asset.filename.includes('icon') || asset.filename.includes('svg');
            case 'fonts': return asset.type === 'font';
            default: return true;
        }
    });
    const handleFileUpload = (event) => {
        const files = event.target.files;
        if (files) {
            onAssetUpload(files);
        }
    };
    const sampleAssets = [
        { id: '1', filename: 'hero-image.jpg', type: 'image', size: 245760, url: '/placeholder.svg' },
        { id: '2', filename: 'logo.svg', type: 'image', size: 12800, url: '/placeholder.svg' },
        { id: '3', filename: 'icon-set.svg', type: 'image', size: 8192, url: '/placeholder.svg' },
        { id: '4', filename: 'background.png', type: 'image', size: 512000, url: '/placeholder.svg' },
    ];
    const formatFileSize = (bytes) => {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };
    return (_jsxs("div", { className: "h-1/2 flex flex-col", children: [_jsxs("div", { className: "p-4 border-b border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Assets" }), _jsxs(Button, { size: "sm", variant: "outline", onClick: () => { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, className: "text-xs", children: [_jsx(Upload, { className: "w-3 h-3 mr-1" }), "Upload"] })] }), _jsx(Tabs, { value: activeAssetTab, onValueChange: (value) => setActiveAssetTab(value), children: _jsxs(TabsList, { className: "grid w-full grid-cols-4 bg-gray-800 h-8", children: [_jsxs(TabsTrigger, { value: "images", className: "text-xs", children: [_jsx(Image, { className: "w-3 h-3 mr-1" }), "Images"] }), _jsxs(TabsTrigger, { value: "icons", className: "text-xs", children: [_jsx(Paintbrush, { className: "w-3 h-3 mr-1" }), "Icons"] }), _jsxs(TabsTrigger, { value: "fonts", className: "text-xs", children: [_jsx(Type, { className: "w-3 h-3 mr-1" }), "Fonts"] }), _jsxs(TabsTrigger, { value: "files", className: "text-xs", children: [_jsx(FileText, { className: "w-3 h-3 mr-1" }), "Files"] })] }) }), _jsx("input", { ref: fileInputRef, type: "file", multiple: true, accept: "image/*,audio/*,video/*,.pdf,.doc,.docx", onChange: handleFileUpload, className: "hidden" })] }), _jsx("div", { className: "flex-1 overflow-y-auto p-2", children: (filteredAssets.length === 0 && sampleAssets.length === 0) ? (_jsxs("div", { className: "text-center text-gray-400 py-8", children: [_jsx(Package, { className: "w-8 h-8 mx-auto mb-2 opacity-50" }), _jsx("p", { className: "text-xs mb-2", children: "No assets uploaded" }), _jsxs(Button, { size: "sm", variant: "outline", onClick: () => { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }, className: "text-xs", children: [_jsx(Upload, { className: "w-3 h-3 mr-1" }), "Upload Assets"] })] })) : (_jsxs("div", { className: "space-y-2", children: [sampleAssets.map((asset) => (_jsxs("div", { className: "group flex items-center gap-3 p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors", children: [_jsx("div", { className: "w-10 h-10 bg-gray-700 rounded flex items-center justify-center flex-shrink-0", children: asset.type === 'image' ? (_jsx("img", { src: asset.url, alt: asset.filename, className: "w-full h-full object-cover rounded" })) : (_jsx(FileText, { className: "w-4 h-4 text-gray-400" })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm text-white truncate", children: asset.filename }), _jsx("div", { className: "text-xs text-gray-400", children: formatFileSize(asset.size) })] }), _jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx(Button, { size: "sm", variant: "ghost", className: "w-6 h-6 p-0", onClick: () => onAssetInsert(asset), title: "Insert Asset", children: _jsx(Plus, { className: "w-3 h-3" }) }), _jsx(Button, { size: "sm", variant: "ghost", className: "w-6 h-6 p-0", title: "More Options", children: _jsx(MoreHorizontal, { className: "w-3 h-3" }) })] })] }, asset.id))), filteredAssets.map((asset) => (_jsxs("div", { className: "group flex items-center gap-3 p-2 bg-gray-800 rounded hover:bg-gray-700 transition-colors", children: [_jsx("div", { className: "w-10 h-10 bg-gray-700 rounded flex items-center justify-center flex-shrink-0", children: asset.type === 'image' ? (_jsx("img", { src: asset.url, alt: asset.filename, className: "w-full h-full object-cover rounded" })) : (_jsx(FileText, { className: "w-4 h-4 text-gray-400" })) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("div", { className: "text-sm text-white truncate", children: asset.filename }), _jsx("div", { className: "text-xs text-gray-400", children: formatFileSize(asset.size) })] }), _jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx(Button, { size: "sm", variant: "ghost", className: "w-6 h-6 p-0", onClick: () => onAssetInsert(asset), title: "Insert Asset", children: _jsx(Plus, { className: "w-3 h-3" }) }), _jsx(Button, { size: "sm", variant: "ghost", className: "w-6 h-6 p-0", title: "Delete Asset", children: _jsx(Trash2, { className: "w-3 h-3 text-red-400" }) })] })] }, asset.id)))] })) })] }));
};
// Placeholder for StatusBar
const StatusBar = (props) => {
    return (_jsx("div", { className: "h-8 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4 text-sm text-gray-400", children: "Status Bar" }));
};
// Placeholder for ErrorToast
const ErrorToast = (props) => {
    return (_jsx("div", { className: "absolute bottom-4 right-4 p-4 bg-red-600 text-white rounded-lg", children: "Errors" }));
};
// Placeholder for findComponentAtPoint
const findComponentAtPoint = (x, y, componentMap) => {
    if (!componentMap)
        return undefined;
    for (const [id, component] of componentMap.entries()) {
        if (x >= component.bounds.x && x <= (component.bounds.x + component.bounds.width) &&
            y >= component.bounds.y && y <= (component.bounds.y + component.bounds.height)) {
            return id;
        }
    }
    return undefined;
};
// Placeholder for syncVisualChangesToCode
const syncVisualChangesToCode = (componentId, updates) => {
    console.log(`Syncing changes for ${componentId}:`, updates);
    // Actual implementation would involve updating the code string in project.files
};
// Placeholder for debounceReparse
const debounceReparse = () => {
    console.log('Debouncing reparse...');
    // Actual implementation would involve a debounced call to re-parse components
};
// Placeholder for syncAllChangesToCode
const syncAllChangesToCode = () => {
    console.log('Syncing all changes to code...');
    // Actual implementation would involve iterating through all visual changes and updating code
};
// Placeholder for handleAssetUpload
const handleAssetUpload = (files) => {
    console.log('Handling asset upload:', files);
};
// Placeholder for handleAssetInsert
const handleAssetInsert = (asset) => {
    console.log('Handling asset insert:', asset);
};
// Placeholder for handleErrorClick
const handleErrorClick = (error) => {
    console.log('Handling error click:', error);
};
// Placeholder for dismissError
const dismissError = (errorId) => {
    console.log('Dismissing error:', errorId);
};
const VisualCanvas = ({ project, selectedComponents, editorState, onSelectionChange, onComponentUpdate, onStateChange, onComponentDrop, isLoading }) => {
    const canvasRef = useRef(null);
    const iframeRef = useRef(null);
    const [previewHtml, setPreviewHtml] = useState('');
    // Generate preview HTML from project
    useEffect(() => {
        const generatePreviewHtml = () => {
            var _a;
            try {
                const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Preview</title>
    <style>
        body { margin: 0; padding: 20px; font-family: system-ui, sans-serif; }
        .component { border: 1px dashed #ccc; padding: 10px; margin: 5px; min-height: 30px; }
        .selected { border-color: #007acc; background-color: rgba(0, 122, 204, 0.1); }
    </style>
</head>
<body>
    <div id="root">
        <h2>Visual Editor Preview</h2>
        <p>Project: ${project.name}</p>
        <p>Framework: ${project.framework}</p>
        ${((_a = project.visualConfig) === null || _a === void 0 ? void 0 : _a.componentMap) ?
                    Array.from(project.visualConfig.componentMap.values()).map(comp => `<div class="component 
${selectedComponents.has(comp.id) ? 'selected' : ''}" data-id="${comp.id}">
              ${comp.type} - ${comp.id}
            </div>`).join('') :
                    '<p>No components yet. Drag components from the library to get started.</p>'}
    </div>
    <script>
        // Handle component selection
        document.addEventListener('click', (e) => {
            const component = e.target.closest('.component');
            if (component) {
                const componentId = component.dataset.id;
                window.parent.postMessage({ type: 'selectComponent', componentId }, '*');
            }
        });
    </script>
</body>
</html>`;
                setPreviewHtml(htmlContent);
            }
            catch (error) {
                console.error('Failed to generate preview HTML:', error);
                setPreviewHtml(`
<!DOCTYPE html>
<html><body>
  <div style="padding: 20px; text-align: center; color: #666;">
    <h3>Preview Error</h3>
    <p>Failed to generate preview: ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}</p>
  </div>
</body></html>`);
            }
        };
        generatePreviewHtml();
    }, [project, selectedComponents]);
    // Handle messages from iframe
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.type === 'selectComponent') {
                const componentId = event.data.componentId;
                onSelectionChange(new Set([componentId]));
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [onSelectionChange]);
    if (isLoading) {
        return (_jsx("div", { className: "flex-1 flex items-center justify-center bg-gray-900", children: _jsxs("div", { className: "text-center", children: [_jsx(RefreshCw, { className: "h-8 w-8 animate-spin mx-auto mb-2 text-blue-400" }), _jsx("p", { className: "text-gray-400", children: "Loading preview..." })] }) }));
    }
    return (_jsx("div", { className: "flex-1 bg-gray-900 relative overflow-hidden", children: _jsx("div", { className: "absolute inset-0 p-4", children: _jsx("iframe", { ref: iframeRef, srcDoc: previewHtml, className: "w-full h-full border border-gray-700 rounded-lg bg-white", title: "Visual Editor Preview", sandbox: "allow-scripts allow-same-origin" }) }) }));
};
const CodeEditor = ({ project, onCodeChange, errors, selectedComponents }) => {
    const [activeFile, setActiveFile] = useState('');
    const [fileContent, setFileContent] = useState('');
    // Initialize with main file
    useEffect(() => {
        const mainFile = getMainFile(project.framework);
        if (project.files[mainFile]) {
            setActiveFile(mainFile);
            setFileContent(project.files[mainFile]);
        }
    }, [project]);
    const handleContentChange = (content) => {
        setFileContent(content);
        if (activeFile) {
            onCodeChange(activeFile, content);
        }
    };
    const fileList = Object.keys(project.files);
    return (_jsxs("div", { className: "flex-1 flex flex-col bg-gray-900", children: [_jsx("div", { className: "flex border-b border-gray-700 bg-gray-800", children: fileList.map(filePath => (_jsx("button", { onClick: () => {
                        setActiveFile(filePath);
                        setFileContent(project.files[filePath] || '');
                    }, className: `px-4 py-2 text-sm border-r border-gray-700 ${activeFile === filePath
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'}
            `, children: filePath.split('/').pop() }, filePath))) }), _jsx("div", { className: "flex-1 relative", children: _jsx(Textarea, { value: fileContent, onChange: (e) => handleContentChange(e.target.value), className: "absolute inset-0 w-full h-full resize-none border-0 bg-gray-900 text-gray-100 font-mono text-sm p-4", placeholder: "Select a file to edit..." }) }), errors.length > 0 && (_jsx("div", { className: "border-t border-gray-700 bg-red-900/20 p-2 max-h-32 overflow-y-auto", children: errors.map((error, index) => (_jsxs("div", { className: "flex items-center gap-2 text-red-400 text-sm py-1", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx("span", { children: error.message })] }, index))) }))] }));
};
// Helper functions that would be implemented
const extractStyleSheets = (files) => {
    return Object.entries(files)
        .filter(([filename]) => filename.endsWith('.css'))
        .map(([, content]) => content);
};
const buildLayoutTree = (components) => {
    // Implementation for building component hierarchy
    return [];
};
const getMainFile = (framework) => {
    switch (framework) {
        case 'react': return 'src/App.jsx';
        case 'vue': return 'src/App.vue';
        case 'angular': return 'src/app/app.component.ts';
        default: return 'index.html';
    }
};
const getDefaultProps = (componentType, framework) => {
    // Return default props based on component type and framework
    return {};
};
const getDefaultStyles = (componentType) => {
    return {
        position: 'absolute',
        width: '100px',
        height: '50px'
    };
};
// Enhanced Component Detector Class with multi-framework support
class ComponentDetector {
    constructor(framework) {
        this.framework = framework;
    }
    detectComponents(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const components = [];
            for (const [filePath, content] of Object.entries(files)) {
                try {
                    switch (this.framework) {
                        case 'react':
                        case 'next':
                        case 'gatsby':
                            components.push(...this.parseReactComponents(content, filePath));
                            break;
                        case 'vue':
                        case 'nuxt':
                            components.push(...this.parseVueComponents(content, filePath));
                            break;
                        case 'angular':
                            components.push(...this.parseAngularComponents(content, filePath));
                            break;
                        case 'svelte':
                        case 'solid':
                        case 'astro':
                        case 'remix':
                            // Placeholder for other frameworks
                            break;
                        default:
                            components.push(...this.parseVanillaComponents(content, filePath));
                    }
                }
                catch (error) {
                    console.warn(`Failed to parse components in ${filePath}:`, error);
                }
            }
            return components;
        });
    }
    parseReactComponents(code, filePath) {
        // Basic React component detection using regex (for demo)
        const components = [];
        const functionMatches = code.match(/function\s+([A-Z][a-zA-Z0-9]*)/g) || [];
        const arrowMatches = code.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*=\s*\(/g) || [];
        [...functionMatches, ...arrowMatches].forEach((match, index) => {
            var _a;
            const name = ((_a = match.match(/([A-Z][a-zA-Z0-9]*)/)) === null || _a === void 0 ? void 0 : _a[1]) || `Component${index}`;
            components.push({
                id: `comp_${name}_${Date.now()}_${index}`,
                type: 'react-component',
                filePath,
                bounds: new DOMRect(50 + index * 20, 50 + index * 20, 200, 100),
                props: {},
                styles: {},
                children: [],
                sourceLocation: { line: 1, column: 1, file: filePath }
            });
        });
        return components;
    }
    parseVueComponents(code, filePath) {
        // Basic Vue component detection
        return [{
                id: `comp_vue_${Date.now()}`,
                type: 'vue-component',
                filePath,
                bounds: new DOMRect(50, 50, 200, 150),
                props: {},
                styles: {},
                children: [],
                sourceLocation: { line: 1, column: 1, file: filePath }
            }];
    }
    parseAngularComponents(code, filePath) {
        const components = [];
        // Parse Angular components
        const componentMatches = code.match(/@Component\s*\(\s*\{[\s\S]*?}\s*\)\s*export\s+class\s+(\w+)/g) || [];
        componentMatches.forEach((match, index) => {
            var _a;
            const className = (_a = match.match(/export\s+class\s+(\w+)/)) === null || _a === void 0 ? void 0 : _a[1];
            if (className) {
                components.push({
                    id: `comp_${className}_${Date.now()}_${index}`,
                    type: 'angular-component',
                    filePath,
                    bounds: new DOMRect(50 + index * 20, 50 + index * 20, 200, 100),
                    props: {},
                    styles: {},
                    children: [],
                    sourceLocation: { line: 1, column: 1, file: filePath }
                });
            }
        });
        return components;
    }
    parseSvelteComponents(code, filePath) {
        var _a;
        const components = [];
        // Parse Svelte components (basic detection)
        if (filePath.endsWith('.svelte')) {
            const scriptMatches = code.match(/<script[^>]*>([\s\S]*?)<\/script>/g) || [];
            const componentName = ((_a = filePath.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace('.svelte', '')) || 'SvelteComponent';
            components.push({
                id: `comp_${componentName}_${Date.now()}`,
                type: 'svelte-component',
                filePath,
                bounds: new DOMRect(50, 50, 200, 100),
                props: {},
                styles: {},
                children: [],
                sourceLocation: { line: 1, column: 1, file: filePath }
            });
        }
        return components;
    }
    parseSolidComponents(code, filePath) {
        const components = [];
        // Parse Solid.js components (similar to React but with different patterns)
        const functionMatches = code.match(/function\s+([A-Z][a-zA-Z0-9]*)/g) || [];
        const arrowMatches = code.match(/const\s+([A-Z][a-zA-Z0-9]*)\s*=\s*\(/g) || [];
        [...functionMatches, ...arrowMatches].forEach((match, index) => {
            var _a;
            const name = ((_a = match.match(/([A-Z][a-zA-Z0-9]*)/)) === null || _a === void 0 ? void 0 : _a[1]) || `SolidComponent${index}`;
            components.push({
                id: `comp_${name}_${Date.now()}_${index}`,
                type: 'solid-component',
                filePath,
                bounds: new DOMRect(50 + index * 20, 50 + index * 20, 200, 100),
                props: {},
                styles: {},
                children: [],
                sourceLocation: { line: 1, column: 1, file: filePath }
            });
        });
        return components;
    }
    parseAstroComponents(code, filePath) {
        var _a;
        const components = [];
        // Parse Astro components
        if (filePath.endsWith('.astro')) {
            const componentName = ((_a = filePath.split('/').pop()) === null || _a === void 0 ? void 0 : _a.replace('.astro', '')) || 'AstroComponent';
            components.push({
                id: `comp_${componentName}_${Date.now()}`,
                type: 'astro-component',
                filePath,
                bounds: new DOMRect(50, 50, 200, 100),
                props: {},
                styles: {},
                children: [],
                sourceLocation: { line: 1, column: 1, file: filePath }
            });
        }
        return components;
    }
    parseRemixComponents(code, filePath) {
        // Remix uses React components, so we can reuse React parsing
        return this.parseReactComponents(code, filePath);
    }
    parseVanillaComponents(code, filePath) {
        if (!filePath.endsWith('.html'))
            return [];
        // Parse HTML elements as components
        const components = [];
        const elementMatches = code.match(/<(\w+)[^>]*>/g) || [];
        elementMatches.forEach((match, index) => {
            var _a;
            const tagName = (_a = match.match(/<(\w+)/)) === null || _a === void 0 ? void 0 : _a[1];
            if (tagName && !['html', 'head', 'body', 'meta', 'title', 'script', 'style'].includes(tagName)) {
                components.push({
                    id: `comp_${tagName}_${Date.now()}_${index}`,
                    type: tagName,
                    filePath,
                    bounds: new DOMRect(50 + index * 10, 50 + index * 10, 150, 50),
                    props: {},
                    styles: {},
                    children: [],
                    sourceLocation: { line: 1, column: 1, file: filePath }
                });
            }
        });
        return components;
    }
}
// Component Renderer
function ComponentRenderer({ component, isSelected, onUpdate, onDrag }) {
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const handleMouseDown = (e) => {
        e.stopPropagation();
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
    };
    const handleMouseMove = useCallback((e) => {
        if (isDragging) {
            const deltaX = e.clientX - dragStart.x;
            const deltaY = e.clientY - dragStart.y;
            onDrag(deltaX, deltaY);
            setDragStart({ x: e.clientX, y: e.clientY });
        }
    }, [isDragging, dragStart, onDrag]);
    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
    }, [isDragging, handleMouseMove, handleMouseUp]);
    const renderComponentContent = () => {
        switch (component.type) {
            case 'div':
            case 'react-component':
                return (_jsx("div", { className: "w-full h-full bg-blue-100 border border-blue-300 rounded flex items-center justify-center text-xs text-blue-800", children: component.type }));
            case 'button':
                return (_jsx("button", { className: "w-full h-full bg-gray-200 border border-gray-400 rounded text-xs", children: "Button" }));
            case 'img':
                return (_jsx("div", { className: "w-full h-full bg-gray-200 border border-gray-400 rounded flex items-center justify-center text-xs text-gray-600", children: _jsx(Image, { className: "w-4 h-4" }) }));
            default:
                return (_jsx("div", { className: "w-full h-full bg-gray-100 border border-gray-300 rounded flex items-center justify-center text-xs text-gray-600", children: component.type }));
        }
    };
    return (_jsx("div", { className: `absolute cursor-move ${isSelected ? 'ring-2 ring-blue-500' : ''}`, onMouseDown: handleMouseDown, style: {
            left: component.bounds.x,
            top: component.bounds.y,
            width: component.bounds.width,
            height: component.bounds.height
        }, children: renderComponentContent() }));
}
export default function VisualEditor({ initialProject, onSaveToOriginal, onClose }) {
    const [project, setProject] = useState(initialProject);
    const [selectedComponents, setSelectedComponents] = useState(new Set());
    const [editorMode, setEditorMode] = useState('design');
    const [errors, setErrors] = useState([]);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [editorState, setEditorState] = useState({
        selectedTool: 'select',
        zoom: 1,
        panOffset: { x: 0, y: 0 },
        snapToGrid: true,
        showGuidelines: true,
        viewport: 'desktop',
        theme: 'dark',
        gridSize: 20,
        showRulers: false,
        showBounds: false,
        showNames: false,
        livePreview: true,
        autoSave: true,
        collaborationMode: false
    });
    // Viewport controls for responsive preview
    const setViewport = (vp) => setEditorState(prev => (Object.assign(Object.assign({}, prev), { viewport: vp })));
    const zoomIn = () => setEditorState(prev => (Object.assign(Object.assign({}, prev), { zoom: Math.min(2, prev.zoom + 0.1) })));
    const zoomOut = () => setEditorState(prev => (Object.assign(Object.assign({}, prev), { zoom: Math.max(0.3, prev.zoom - 0.1) })));
    const [undoHistory, setUndoHistory] = useState([]);
    const [redoHistory, setRedoHistory] = useState([]);
    // Initialize visual editor
    useEffect(() => {
        initializeVisualEditor();
    }, []);
    const initializeVisualEditor = () => __awaiter(this, void 0, void 0, function* () {
        try {
            setIsPreviewLoading(true);
            // Parse components from code
            const componentDetector = new ComponentDetector(project.framework);
            const detectedComponents = yield componentDetector.detectComponents(project.files);
            // Initialize visual config
            const visualConfig = {
                componentMap: new Map(detectedComponents.map(comp => [comp.id, comp])),
                styleSheets: extractStyleSheets(project.files),
                assets: new Map(),
                layoutTree: buildLayoutTree(detectedComponents),
                editorState,
                lastSyncTimestamp: Date.now()
            };
            setProject(prev => (Object.assign(Object.assign({}, prev), { visualConfig })));
            // Add to undo history
            setUndoHistory([initialProject]);
        }
        catch (error) {
            setErrors(prev => [...prev, {
                    type: 'parse',
                    message: `Failed to initialize visual editor: ${(error === null || error === void 0 ? void 0 : error.message) || 'Unknown error'}`,
                    id: `error_${Date.now()}`
                }]);
        }
        finally {
            setIsPreviewLoading(false);
        }
    });
    const handleComponentDrop = useCallback((componentType, position) => {
        const newComponent = {
            id: `comp_${Date.now()}`,
            type: componentType,
            filePath: getMainFile(project.framework),
            bounds: new DOMRect(position.x, position.y, 100, 50),
            props: getDefaultProps(componentType, project.framework),
            styles: getDefaultStyles(componentType),
            children: [],
            sourceLocation: { line: 1, column: 1, file: getMainFile(project.framework) }
        };
        setProject(prev => {
            const updated = Object.assign({}, prev);
            if (updated.visualConfig) {
                updated.visualConfig.componentMap.set(newComponent.id, newComponent);
                updated.visualConfig.layoutTree = buildLayoutTree(Array.from(updated.visualConfig.componentMap.values()));
                updated.visualConfig.lastSyncTimestamp = Date.now();
            }
            return updated;
        });
        // Add to undo history
        addToUndoHistory();
    }, [project.framework]);
    const handleComponentUpdate = useCallback((componentId, updates) => {
        setProject(prev => {
            var _a;
            const updated = Object.assign({}, prev);
            if ((_a = updated.visualConfig) === null || _a === void 0 ? void 0 : _a.componentMap.has(componentId)) {
                const component = updated.visualConfig.componentMap.get(componentId);
                updated.visualConfig.componentMap.set(componentId, Object.assign(Object.assign({}, component), updates));
                updated.visualConfig.lastSyncTimestamp = Date.now();
            }
            return updated;
        });
        // Sync changes back to code
        syncVisualChangesToCode(componentId, updates);
    }, []);
    const handlePropertyChange = useCallback((componentId, property, value) => {
        var _a, _b;
        handleComponentUpdate(componentId, {
            props: Object.assign(Object.assign({}, (_b = (_a = project.visualConfig) === null || _a === void 0 ? void 0 : _a.componentMap.get(componentId)) === null || _b === void 0 ? void 0 : _b.props), { [property]: value })
        });
    }, [handleComponentUpdate, project.visualConfig]);
    const handleCodeChange = useCallback((filePath, newCode) => {
        setProject(prev => (Object.assign(Object.assign({}, prev), { files: Object.assign(Object.assign({}, prev.files), { [filePath]: newCode }) })));
        // Re-parse components after code change
        debounceReparse();
    }, []);
    const addToUndoHistory = () => {
        setUndoHistory(prev => [...prev.slice(-19), project]); // Keep last 20 states
        setRedoHistory([]); // Clear redo history
    };
    const undo = () => {
        if (undoHistory.length > 1) {
            const previousState = undoHistory[undoHistory.length - 2];
            setRedoHistory(prev => [project, ...prev.slice(0, 19)]);
            setUndoHistory(prev => prev.slice(0, -1));
            setProject(previousState);
        }
    };
    const redo = () => {
        if (redoHistory.length > 0) {
            const nextState = redoHistory[0];
            setUndoHistory(prev => [...prev, project]);
            setRedoHistory(prev => prev.slice(1));
            setProject(nextState);
        }
    };
    const saveProject = () => {
        // Sync visual changes back to code
        syncAllChangesToCode();
        onSaveToOriginal === null || onSaveToOriginal === void 0 ? void 0 : onSaveToOriginal(project);
    };
    return (_jsxs("div", { className: "h-screen w-screen bg-gray-900 flex flex-col", children: [_jsx(VisualEditorToolbar, { project: project, editorMode: editorMode, editorState: editorState, onModeChange: setEditorMode, onToolChange: (tool) => setEditorState(prev => (Object.assign(Object.assign({}, prev), { selectedTool: tool }))), onSave: saveProject, onUndo: undo, onRedo: redo, onClose: onClose, canUndo: undoHistory.length > 1, canRedo: redoHistory.length > 0, errors: errors }), _jsxs("div", { className: "flex-1 flex overflow-hidden", children: [_jsxs("div", { className: "w-80 bg-gray-800 border-r border-gray-700 flex flex-col", children: [_jsx(ComponentLibraryPanel, { framework: project.framework, onComponentDrop: handleComponentDrop }), _jsx(PropertyInspectorPanel, { selectedComponents: selectedComponents, project: project, onPropertyChange: handlePropertyChange })] }), _jsxs("div", { className: "flex-1 flex flex-col", children: [(editorMode === 'design' || editorMode === 'split') && (_jsx("div", { className: editorMode === 'split' ? 'h-1/2' : 'flex-1', children: _jsx(VisualCanvas, { project: project, selectedComponents: selectedComponents, editorState: editorState, onSelectionChange: setSelectedComponents, onComponentUpdate: handleComponentUpdate, onStateChange: setEditorState, onComponentDrop: handleComponentDrop, isLoading: isPreviewLoading }) })), (editorMode === 'code' || editorMode === 'split') && (_jsx("div", { className: editorMode === 'split' ? 'h-1/2 border-t border-gray-700' : 'flex-1', children: _jsx(CodeEditor, { project: project, onCodeChange: handleCodeChange, errors: errors, selectedComponents: selectedComponents }) }))] }), _jsxs("div", { className: "w-64 bg-gray-800 border-l border-gray-700 flex flex-col", children: [_jsx(LayersPanel, { project: project, selectedComponents: selectedComponents, onSelectionChange: setSelectedComponents, onComponentUpdate: handleComponentUpdate }), _jsx(AssetsPanel, { project: project, onAssetUpload: handleAssetUpload, onAssetInsert: handleAssetInsert })] })] }), _jsx(StatusBar, { project: project, editorState: editorState, errors: errors, onErrorClick: handleErrorClick }), _jsx(ErrorToast, { errors: errors, onDismiss: dismissError })] }));
}
// Toolbar Component
function VisualEditorToolbar({ project, editorMode, editorState, onModeChange, onToolChange, onSave, onUndo, onRedo, onClose, canUndo, canRedo, errors }) {
    const errorCount = errors.filter(e => e.type === 'runtime').length;
    const warningCount = errors.filter(e => e.type === 'parse').length;
    return (_jsxs("div", { className: "h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex bg-gray-700 rounded-lg", children: [_jsxs(Button, { size: "sm", variant: editorMode === 'design' ? 'default' : 'ghost', onClick: () => onModeChange('design'), className: "rounded-r-none", children: [_jsx(Eye, { className: "w-4 h-4 mr-2" }), "Design"] }), _jsx(Button, { size: "sm", variant: editorMode === 'split' ? 'default' : 'ghost', onClick: () => onModeChange('split'), className: "rounded-none border-x border-gray-600", children: "Split" }), _jsxs(Button, { size: "sm", variant: editorMode === 'code' ? 'default' : 'ghost', onClick: () => onModeChange('code'), className: "rounded-l-none", children: [_jsx(Code, { className: "w-4 h-4 mr-2" }), "Code"] })] }), editorMode !== 'code' && (_jsxs("div", { className: "flex items-center gap-1 bg-gray-700 rounded-lg p-1", children: [_jsx(Button, { size: "sm", variant: editorState.selectedTool === 'select' ? 'default' : 'ghost', onClick: () => onToolChange('select'), title: "Select Tool", children: _jsx(MousePointer, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: editorState.selectedTool === 'move' ? 'default' : 'ghost', onClick: () => onToolChange('move'), title: "Move Tool", children: _jsx(Move, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: editorState.selectedTool === 'text' ? 'default' : 'ghost', onClick: () => onToolChange('text'), title: "Text Tool", children: _jsx(Type, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: editorState.selectedTool === 'image' ? 'default' : 'ghost', onClick: () => onToolChange('image'), title: "Image Tool", children: _jsx(Image, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: editorState.selectedTool === 'shape' ? 'default' : 'ghost', onClick: () => onToolChange('shape'), title: "Shape Tool", children: _jsx(Square, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: editorState.selectedTool === 'component' ? 'default' : 'ghost', onClick: () => onToolChange('component'), title: "Component Tool", children: _jsx(Component, { className: "w-4 h-4" }) })] })), editorMode !== 'code' && (_jsxs("div", { className: "flex items-center gap-1 bg-gray-700 rounded-lg p-1", children: [_jsx(Button, { size: "sm", variant: editorState.viewport === 'desktop' ? 'default' : 'ghost', onClick: () => editorState.viewport = 'desktop', title: "Desktop View", children: _jsx(Monitor, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: editorState.viewport === 'tablet' ? 'default' : 'ghost', onClick: () => editorState.viewport = 'tablet', title: "Tablet View", children: _jsx(Tablet, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: editorState.viewport === 'mobile' ? 'default' : 'ghost', onClick: () => editorState.viewport = 'mobile', title: "Mobile View", children: _jsx(Smartphone, { className: "w-4 h-4" }) })] }))] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center gap-1", children: [_jsx(Button, { size: "sm", variant: "ghost", onClick: onUndo, disabled: !canUndo, title: "Undo", children: _jsx(Undo, { className: "w-4 h-4" }) }), _jsx(Button, { size: "sm", variant: "ghost", onClick: onRedo, disabled: !canRedo, title: "Redo", children: _jsx(Redo, { className: "w-4 h-4" }) })] }), _jsxs(Button, { size: "sm", onClick: onSave, children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), "Save"] }), (errorCount > 0 || warningCount > 0) && (_jsxs("div", { className: "flex items-center gap-2", children: [errorCount > 0 && (_jsxs(Badge, { variant: "destructive", className: "text-xs", children: [_jsx(AlertCircle, { className: "w-3 h-3 mr-1" }), errorCount, " Errors"] })), warningCount > 0 && (_jsxs(Badge, { variant: "outline", className: "text-xs", children: [_jsx(Info, { className: "w-3 h-3 mr-1" }), warningCount, " Warnings"] }))] })), onClose && (_jsx(Button, { size: "sm", variant: "ghost", onClick: onClose, title: "Close Editor", children: _jsx(X, { className: "w-4 h-4" }) }))] })] }));
}

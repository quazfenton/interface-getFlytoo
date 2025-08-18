// Enhanced version of swap-frontend.js implementing advanced methodology
// Changes include Babel integration, semantic analysis, dependency resolution,
// testing, CLI support, and performance optimizations

const fs = require('fs').promises;
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const commander = require('commander'); // Added for CLI support
const postcss = require('postcss'); // Added for CSS parsing
const postcssScss = require('postcss-scss'); // Added for SCSS parsing
const chroma = require('chroma-js'); // Added for color manipulation
const { exec } = require('child_process'); // Added for running shell commands
const AssetGenerator = require('./AssetGenerator');
const AIAnalyzer = require('./AIAnalyzer');
const Benchmarker = require('./Benchmarker');
const Visualizer = require('./Visualizer');

// Type definitions for structured data
/**
 * @typedef {Object} FileInfo
 * @property {string} filePath - Absolute path to the file
 * @property {string} relativePath - Path relative to the project root
 * @property {string} fileName - Base name of the file
 * @property {string} fileExtension - Extension of the file
 * @property {string} type - Categorization (e.g., 'component', 'page', 'util', 'asset', 'config')
 * @property {string} [componentName] - If type is 'component' or 'page', the inferred component name
 */

/**
 * @typedef {Object} ProjectAnalysis
 * @property {string} rootPath - Absolute path to the project root
 * @property {string} framework - Detected framework (e.g., 'react', 'vue', 'angular')
 * @property {FileInfo[]} files - List of all relevant files found
 * @property {Object.<string, FileInfo[]>} categorizedFiles - Files categorized by type
 * @property {Object.<string, FileInfo>} componentMap - Maps component names to their FileInfo
 * @property {Object.<string, string[]>} dependencyGraph - Maps file paths to their direct dependencies
 * @property {Object.<string, any>} architecturalPatterns - Detected patterns (e.g., { redux: true })
 * @property {Object.<string, any>} semanticContext - High-level understanding of file purposes
 * @property {Object.<string, any>} styleInfo - Extracted style information (e.g., color palettes, typography)
 * @property {Object} aestheticProfile - e.g., { paletteType: 'vibrant', layout: 'grid', density: 'high' }
 * @property {Object} packageJson - Parsed content of package.json
 */

/**
 * FrontendMigrator: A Hyper-Adaptive Interface Harmonizer for migrating frontend components,
 * styles, and visual elements between projects while retaining functionality.
 * Enhanced with Babel for AST manipulation, CLI support, and testing integration.
 */
class FrontendMigrator {
    /**
     * @param {string} projectAPath - Absolute path to the target project (Project A)
     * @param {string} projectBPath - Absolute path to the source project (Project B)
     * @param {Object} options - Configuration options for the migration
     * @param {string[]} [options.componentDirs=['src/components', 'src/pages', 'src/views']] - Directories to scan for components/pages
     * @param {string[]} [options.utilDirs=['src/utils', 'src/helpers', 'src/lib']] - Directories to scan for utility files
     * @param {string[]} [options.assetDirs=['src/assets', 'public']] - Directories to scan for static assets
     * @param {string[]} [options.configDirs=['src/config', 'src/constants', 'src/services']] - Directories for configuration/service files
     * @param {string[]} [options.ignoreDirs=['node_modules', '.git', 'dist', 'build', 'coverage']] - Directories to ignore during scan
     * @param {string[]} [options.fileExtensions=['.js', '.jsx', '.ts', '.tsx', '.vue', '.html', '.css', '.scss', '.less', '.json', '.svg', '.png', '.jpg', '.jpeg', '.gif']] - File extensions to consider
     * @param {boolean} [options.dryRun=false] - If true, no files will be written
     * @param {Object.<string, string>} [options.componentNameMapping={}] - Manual mapping for component name conflicts
     * @param {Object.<string, string>} [options.importPathRewrites={}] - Manual rewrites for import paths
     * @param {Function} [options.customFileTransformer=null] - Custom transformation function
     * @param {boolean} [options.generateTests=false] - If true, generate test files for migrated components
     * @param {string} [options.styleTransformationStrategy='none'] - Strategy for transforming styles ('none', 'basic-mapping', 'prefix-styles')
     * @param {string} [options.stylePrefix='migrated-'] - Prefix to add to CSS selectors when using 'prefix-styles' strategy
     * @param {'migrate' | 'prototype' | 'diff'} [options.outputMode='migrate'] - Output mode for the engine
     * @param {string} [options.prototypeDir='prototypes/generated'] - Directory for prototype output
     * @param {'auto' | 'minimalist' | 'vibrant' | 'custom'} [options.aestheticProfile='auto'] - User-defined or auto-detected aesthetic profile
     * @param {'strict' | 'approximate' | 'fallback'} [options.mismatchStrategy='approximate'] - Strategy for handling mismatches
     * @param {Object} [options.userParams={}] - Object for user choices
     */
    constructor(projectAPath, projectBPath, options = {}) {
        this.projectAPath = path.resolve(projectAPath);
        this.projectBPath = path.resolve(projectBPath);
        this.options = {
            componentDirs: ['src/components', 'src/pages', 'src/views'],
            utilDirs: ['src/utils', 'src/helpers', 'src/lib'],
            assetDirs: ['src/assets', 'public'],
            configDirs: ['src/config', 'src/constants', 'src/services'],
            ignoreDirs: ['node_modules', '.git', 'dist', 'build', 'coverage'],
            fileExtensions: ['.js', '.jsx', '.ts', '.tsx', '.vue', '.html', '.css', '.scss', '.less', '.json', '.svg', '.png', '.jpg', '.jpeg', '.gif'],
            dryRun: false,
            componentNameMapping: {},
            importPathRewrites: {},
            customFileTransformer: null,
            generateTests: false, // New option for test generation
            styleTransformationStrategy: 'none', // New option for style transformation
            stylePrefix: 'migrated-', // New option for style prefixing
            outputMode: 'migrate', // New option for output mode
            prototypeDir: 'prototypes/generated', // New option for prototype directory
            aestheticProfile: 'auto', // New option for aesthetic profile
            mismatchStrategy: 'approximate', // New option for mismatch strategy
            userParams: {}, // New option for user parameters
            ...options
        };

        this.projectAAnalysis = null;
        this.projectBAnalysis = null;
        this.migrationLog = [];

        this.assetGenerator = new AssetGenerator();
        this.aiAnalyzer = new AIAnalyzer();
        this.benchmarker = new Benchmarker();
        this.visualizer = new Visualizer();

        // Enhanced logging with initialization message
        this.log(`🚀 Initializing Hyper-Adaptive Interface Harmonizer for Project A: ${this.projectAPath} and Project B: ${this.projectBPath}`);
        if (this.options.dryRun) {
            this.log("⚠️ Running in DRY RUN mode. No files will be modified.", 'warn');
        }
    }

    /**
     * Logs a message with timestamp and level, storing it for auditing.
     * @param {string} message - The message to log
     * @param {string} [level='info'] - Log level ('info', 'warn', 'error')
     */
    log(message, level = 'info') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
        this.migrationLog.push(logEntry);
        if (level === 'error') {
            console.error(logEntry);
        } else if (level === 'warn') {
            console.warn(logEntry);
        } else {
            console.log(logEntry);
        }
    }

    /**
     * Analyzes a project's file structure, categorizing files and detecting frameworks.
     * Enhanced to parse tsconfig.json for import aliases.
     * @param {string} projectPath - The root path of the project
     * @returns {Promise<ProjectAnalysis>} - Analysis results
     */
    async analyzeProjectStructure(projectPath) {
        this.log(`🔍 Analyzing project structure: ${projectPath}`);
        const files = [];
        const categorizedFiles = {
            component: [],
            page: [],
            util: [],
            asset: [],
            config: [],
            other: []
        };
        const componentMap = {};
        const styleInfo = {}; // Initialize styleInfo

        let packageJson = {};
        try {
            const packageJsonPath = path.join(projectPath, 'package.json');
            const packageJsonContent = await fs.readFile(packageJsonPath, 'utf8');
            packageJson = JSON.parse(packageJsonContent);
        } catch (error) {
            this.log(`  Could not read package.json for ${projectPath}: ${error.message}`, 'warn');
        }

        const framework = this._detectFramework(packageJson); // Pass parsed packageJson
        const aliases = await this._parseTsconfigAliases(projectPath); // New: Parse tsconfig for aliases
        this.log(`  Detected framework: ${framework || 'Unknown'}`);
        this.log(`  Detected import aliases: ${JSON.stringify(aliases)}`);

        const traverse = async (currentPath, relativePath = '') => {
            const entries = await fs.readdir(currentPath, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(currentPath, entry.name);
                const currentRelativePath = path.join(relativePath, entry.name);

                if (this.options.ignoreDirs.some(dir => currentRelativePath.startsWith(dir) || entry.name === dir)) {
                    continue;
                }

                if (entry.isDirectory()) {
                    await traverse(fullPath, currentRelativePath);
                } else if (entry.isFile()) {
                    const fileExtension = path.extname(entry.name).toLowerCase();
                    if (!this.options.fileExtensions.includes(fileExtension)) {
                        continue;
                    }

                    const fileInfo = {
                        filePath: fullPath,
                        relativePath: currentRelativePath,
                        fileName: entry.name,
                        fileExtension,
                        type: 'other'
                    };

                    // Categorize files based on directory and extension
                    const isComponentOrPage = this.options.componentDirs.some(dir => currentRelativePath.startsWith(dir));
                    const isUtil = this.options.utilDirs.some(dir => currentRelativePath.startsWith(dir));
                    const isAsset = this.options.assetDirs.some(dir => currentRelativePath.startsWith(dir));
                    const isConfig = this.options.configDirs.some(dir => currentRelativePath.startsWith(dir));

                    if (isComponentOrPage && ['.js', '.jsx', '.ts', '.tsx', '.vue'].includes(fileExtension)) {
                        fileInfo.type = currentRelativePath.includes('pages') || currentRelativePath.includes('views') ? 'page' : 'component';
                        fileInfo.componentName = path.basename(entry.name, fileExtension);
                        componentMap[fileInfo.componentName] = fileInfo;
                    } else if (isUtil) {
                        fileInfo.type = 'util';
                    } else if (isAsset) {
                        fileInfo.type = 'asset';
                    } else if (isConfig) {
                        fileInfo.type = 'config';
                    } else if (['.css', '.scss', '.less'].includes(fileExtension)) {
                        fileInfo.type = 'style';
                        const extractedData = await this._extractStylesFromFile(fullPath);
                        styleInfo[fileInfo.relativePath] = extractedData;
                    }

                    files.push(fileInfo);
                    categorizedFiles[fileInfo.type].push(fileInfo);
                }
            }
        };

        await traverse(projectPath);
        this.log(`  Found ${files.length} relevant files.`);
        return {
            rootPath: projectPath,
            framework,
            files,
            categorizedFiles,
            componentMap,
            dependencyGraph: {},
            architecturalPatterns: {},
            semanticContext: {},
            styleInfo, // Include styleInfo in the returned analysis
            aliases, // New: Store aliases for import resolution
            packageJson // Include packageJson in the returned analysis
        };
    }

    /**
     * Parses tsconfig.json to extract path aliases for import resolution.
     * @param {string} projectPath - The project root path
     * @returns {Promise<Object.<string, string>>} - Alias mappings (e.g., {'@/*': 'src/*'})
     */
    async _parseTsconfigAliases(projectPath) {
        try {
            const tsconfigPath = path.join(projectPath, 'tsconfig.json');
            const tsconfigContent = await fs.readFile(tsconfigPath, 'utf8');
            const tsconfig = JSON.parse(tsconfigContent);
            return tsconfig.compilerOptions?.paths || {};
        } catch (error) {
            this.log(`  Could not parse tsconfig.json for ${projectPath}: ${error.message}`, 'warn');
            return {};
        }
    }

    /**
     * Extracts style information from CSS/SCSS/Less files.
     * @param {string} filePath - Path to the style file
     * @returns {Promise<Object>} - Extracted style data
     */
    async _extractStylesFromFile(filePath) {
        this.log(`    [Style Extraction] Extracting styles from ${filePath}`);
        try {
            const content = await fs.readFile(filePath, 'utf8');
            const fileExtension = path.extname(filePath).toLowerCase();
            let syntax = null;
            if (fileExtension === '.scss') {
                syntax = require('postcss-scss');
            }

            const root = postcss().parse(content, { syntax });

            const extractedData = {
                filePath: filePath,
                colors: new Set(),
                fontFamilies: new Set(),
                fontSizes: new Set(),
                properties: {},
                selectors: new Set()
            };

            root.walkRules(rule => {
                extractedData.selectors.add(rule.selector);
                rule.walkDecls(decl => {
                    // Extract colors
                    if (/(color|background|border)-?/.test(decl.prop) && decl.value.match(/#([a-fA-F0-9]{3}){1,2}|rgb\(\d+,\d+,\d+\)|rgba\(\d+,\d+,\d+,[0-9\.]+\)|hsl\(\d+,\d+%,\d+%\)|hsla\(\d+,\d+%,\d+%,[0-9\.]+\)/)) {
                        extractedData.colors.add(decl.value);
                    }
                    // Extract font families
                    if (decl.prop === 'font-family') {
                        decl.value.split(',').forEach(font => extractedData.fontFamilies.add(font.trim().replace(/['"]/g, '')));
                    }
                    // Extract font sizes
                    if (decl.prop === 'font-size') {
                        extractedData.fontSizes.add(decl.value);
                    }

                    // Store all properties for general analysis
                    if (!extractedData.properties[decl.prop]) {
                        extractedData.properties[decl.prop] = new Set();
                    }
                    extractedData.properties[decl.prop].add(decl.value);
                });
            });

            // Convert Sets to Arrays for JSON serialization
            for (const key in extractedData) {
                if (extractedData[key] instanceof Set) {
                    extractedData[key] = Array.from(extractedData[key]);
                }
            }
            for (const prop in extractedData.properties) {
                extractedData.properties[prop] = Array.from(extractedData.properties[prop]);
            }

            return extractedData;
        } catch (error) {
            this.log(`    Failed to extract styles from ${filePath}: ${error.message}`, 'error');
            return {};
        }
    }

    /**
     * Detects the frontend framework from package.json.
     * @param {Object} packageJson - Parsed package.json content
     * @returns {string|null} - Framework name or null
     */
    _detectFramework(packageJson) {
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

        if (dependencies['react'] || dependencies['react-dom']) return 'react';
        if (dependencies['vue']) return 'vue';
        if (dependencies['@angular/core']) return 'angular';
        if (dependencies['svelte']) return 'svelte';
        if (dependencies['solid-js']) return 'solid'; // Added solid-js detection
        if (dependencies['next']) return 'next'; // Added next detection
        if (dependencies['nuxt']) return 'nuxt'; // Added nuxt detection
        if (dependencies['gatsby']) return 'gatsby'; // Added gatsby detection
        if (dependencies['vite']) return 'vite'; // Added vite detection
        if (dependencies['astro']) return 'astro'; // Added astro detection
        if (dependencies['@remix-run/react']) return 'remix'; // Added remix detection
        return null;
    }

    /**
     * Parses code into an AST for analysis and transformation.
     * Enhanced with Babel integration for real AST processing.
     * @param {string} code - Source code
     * @param {string} filePath - File path for context
     * @returns {object|null} - Parsed AST or null on failure
     */
    _parseCodeToAST(code, filePath) {
        try {
            const plugins = [];
            if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) plugins.push('jsx');
            if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) plugins.push('typescript');
            return parser.parse(code, {
                sourceType: 'module',
                plugins
            });
        } catch (error) {
            this.log(`    Failed to parse AST for ${filePath}: ${error.message}`, 'error');
            return null;
        }
    }

    /**
     * Performs semantic analysis to understand file roles and patterns.
     * Enhanced to detect React hooks and state management patterns.
     * @param {object} ast - The AST of the file
     * @param {FileInfo} fileInfo - File information
     * @param {ProjectAnalysis} projectAnalysis - Project analysis
     * @returns {object} - Semantic insights
     */
    _performSemanticAnalysis(ast, fileInfo, projectAnalysis) {
        this.log(`    [Semantic Analysis] Analyzing ${fileInfo.relativePath}`);
        const insights = {
            role: 'unknown',
            exportedEntities: [],
            importedEntities: [],
            dataFlow: [],
            usesHooks: false, // New: Track React hooks
            inlineStyles: [] // New: Track inline styles
        };

        // Traverse AST to detect patterns
        traverse(ast, {
            // Detect React functional components
            FunctionDeclaration(path) {
                if (path.node.id.name[0] === path.node.id.name[0].toUpperCase()) {
                    insights.role = 'Component';
                    insights.exportedEntities.push(path.node.id.name);
                }
            },
            // Detect React hooks (e.g., useState, useEffect)
            CallExpression(path) {
                if (path.node.callee.name?.startsWith('use') && projectAnalysis.framework === 'react') {
                    insights.usesHooks = true;
                    insights.dataFlow.push(`Hook: ${path.node.callee.name}`);
                }
            },
            // Detect inline styles in JSX
            JSXAttribute(path) {
                if (path.node.name.name === 'style' && path.node.value.expression.type === 'ObjectExpression') {
                    const properties = path.node.value.expression.properties.map(prop => {
                        return `${prop.key.name || prop.key.value}: ${prop.value.value}`;
                    });
                    insights.inlineStyles.push(properties.join('; '));
                }
            }
        });

        projectAnalysis.semanticContext[fileInfo.relativePath] = insights;
        return insights;
    }

    /**
     * Reconstructs the dependency graph from import statements.
     * Enhanced to resolve aliases using tsconfig paths.
     * @param {object} ast - The AST of the file
     * @param {FileInfo} fileInfo - File information
     * @param {ProjectAnalysis} projectAnalysis - Project analysis
     * @returns {string[]} - List of dependencies
     */
    _reconstructDependencyGraph(ast, fileInfo, projectAnalysis) {
        this.log(`    [Dependency Graph] Reconstructing dependencies for ${fileInfo.relativePath}`);
        const dependencies = [];

        traverse(ast, {
            ImportDeclaration(path) {
                let importedModule = path.node.source.value;
                // Resolve aliases (e.g., '@/' to 'src/')
                for (const [alias, target] of Object.entries(projectAnalysis.aliases)) {
                    const aliasPattern = alias.replace('/*', '');
                    if (importedModule.startsWith(aliasPattern)) {
                        importedModule = importedModule.replace(aliasPattern, target.replace('/*', ''));
                    }
                }
                dependencies.push(importedModule);
            },
            CallExpression(path) {
                if (path.node.callee.type === 'Import' && path.node.arguments[0]) {
                    dependencies.push(path.node.arguments[0].value);
                }
            }
        });

        projectAnalysis.dependencyGraph[fileInfo.relativePath] = dependencies;
        return dependencies;
    }

    /**
     * Identifies architectural patterns (e.g., Redux, Context API).
     * Enhanced to detect specific imports like react-redux.
     * @param {object} ast - The AST of the file
     * @param {FileInfo} fileInfo - File information
     * @param {ProjectAnalysis} projectAnalysis - Project analysis
     */
    _recognizeArchitecturalPatterns(ast, fileInfo, projectAnalysis) {
        this.log(`    [Pattern Recognition] Analyzing patterns in ${fileInfo.relativePath}`);
        traverse(ast, {
            ImportDeclaration(path) {
                if (path.node.source.value === 'react-redux') {
                    projectAnalysis.architecturalPatterns.redux = true;
                }
                if (path.node.source.value.includes('context') && projectAnalysis.framework === 'react') {
                    projectAnalysis.architecturalPatterns.contextApi = projectAnalysis.architecturalPatterns.contextApi || [];
                    projectAnalysis.architecturalPatterns.contextApi.push(fileInfo.fileName);
                }
            }
        });
    }

    /**
     * Adapts AST to target project's conventions.
     * Enhanced with basic import path rewriting for React projects.
     * @param {object} ast - The AST to transform
     * @param {FileInfo} sourceFileInfo - Source file info
     * @param {ProjectAnalysis} projectAAnalysis - Target project analysis
     * @param {ProjectAnalysis} projectBAnalysis - Source project analysis
     * @returns {object} - Transformed AST
     */
    _adaptToTargetConventions(ast, sourceFileInfo, projectAAnalysis, projectBAnalysis) {
        this.log(`    [Contextual Adaptation] Adapting ${sourceFileInfo.relativePath} to Project A`);
        // Add: Framework bridging (simplified; use libraries like 'vue-to-react' for real impl)
        if (projectBAnalysis.framework !== projectAAnalysis.framework) {
            if (projectBAnalysis.framework === 'vue' && projectAAnalysis.framework === 'react') {
                this.log(`      Attempting to bridge Vue component to React: ${sourceFileInfo.relativePath}`);
                // Traverse AST to convert <template> to JSX, etc.
                // This is highly complex and would require a dedicated transpiler or library.
                // For now, this is a conceptual placeholder.
                traverse(ast, { /* Vue-specific transformations */ });
            }
        }

        traverse(ast, {
            ImportDeclaration(path) {
                let importPath = path.node.source.value;
                // Apply user-defined import path rewrites
                for (const [oldPath, newPath] of Object.entries(projectAAnalysis.options.importPathRewrites)) {
                    if (importPath === oldPath) {
                        path.node.source.value = newPath;
                    }
                }
                // Convert relative imports to absolute based on Project A's aliases
                for (const [alias, target] of Object.entries(projectAAnalysis.aliases)) {
                    const aliasPattern = alias.replace('/*', '');
                    if (importPath.startsWith('./') || importPath.startsWith('../')) {
                        const absolutePath = path.resolve(path.dirname(sourceFileInfo.filePath), importPath);
                        const relativeToSrc = path.relative(path.join(projectAAnalysis.rootPath, 'src'), absolutePath);
                        path.node.source.value = `${aliasPattern}${relativeToSrc}`;
                    }
                }
            },
            // Rename components based on mapping
            JSXIdentifier(path) {
                const oldName = path.node.name;
                if (projectAAnalysis.options.componentNameMapping[oldName]) {
                    path.node.name = projectAAnalysis.options.componentNameMapping[oldName];
                }
            },
            // Add background matching
            JSXAttribute(path) {
                if (path.node.name.name === 'style' && path.node.value.expression.type === 'ObjectExpression') {
                    const properties = path.node.value.expression.properties;
                    const backgroundProp = properties.find(p => p.key.name === 'background' || p.key.value === 'background');
                    if (backgroundProp) {
                        const bgValue = backgroundProp.value.value; // Assuming string literal for simplicity
                        // Check if background matches aesthetic profile of Project A
                        // This would require a more sophisticated _matchesAesthetic method
                        // For now, a placeholder for substitution.
                        if (bgValue && !this._matchesAesthetic(bgValue, projectAAnalysis.aestheticProfile)) {
                            // Example: generate similar gradient or use a fallback
                            const substitutedBg = this._substituteBackground(bgValue); 
                            backgroundProp.value.value = substitutedBg;
                            this.log(`      Substituted background in ${sourceFileInfo.relativePath}: ${bgValue} -> ${substitutedBg}`);
                        }
                    }
                }
            }
        });
        return ast;
    }

    /**
     * Placeholder for _matchesAesthetic method.
     * @param {string} value
     * @param {Object} aestheticProfile
     * @returns {boolean}
     */
    _matchesAesthetic(value, aestheticProfile) {
        // Implement logic to check if a style value matches the aesthetic profile
        // For example, check if a color is within the palette, or if a font is part of the theme.
        return true; // Placeholder
    }

    /**
     * Placeholder for _substituteBackground method.
     * @param {string} originalBgValue
     * @returns {string}
     */
    _substituteBackground(originalBgValue) {
        // Implement logic to generate a similar gradient or use a fallback background
        return `linear-gradient(to right, #ccc, #eee)`; // Placeholder
    }

    /**
     * Generates a basic Jest test for a component.
     * New feature to support automated testing.
     * @param {FileInfo} fileInfo - File information
     * @param {string} targetBasePath - Target directory
     * @returns {Promise<void>}
     */
    async _generateComponentTest(fileInfo, targetBasePath) {
        const testFileName = `${fileInfo.componentName || fileInfo.fileName}.test${fileInfo.fileExtension}`;
        const testFilePath = path.join(targetBasePath, '__tests__', testFileName);
        const componentName = fileInfo.componentName || path.basename(fileInfo.fileName, fileInfo.fileExtension);

        const testContent = `
import React from 'react';
import { render, screen } from '@testing-library/react';
import ${componentName} from '../${fileInfo.relativePath}';

describe('${componentName}', () => {
  it('renders without crashing', () => {
    render(<${componentName} />);
    expect(screen.getByTestId('${componentName.toLowerCase()}-container')).toBeInTheDocument();
  });
});
`;

        if (!this.options.dryRun) {
            await fs.mkdir(path.dirname(testFilePath), { recursive: true });
            await fs.writeFile(testFilePath, testContent, 'utf8');
            this.log(`    Generated test file: ${testFilePath}`);
        } else {
            this.log(`    DRY RUN: Would generate test file: ${testFilePath}`);
        }
    }

    /**
     * Copies and transforms a file, applying AST-based transformations.
     * Enhanced with parallel processing and test generation.
     * @param {FileInfo} sourceFileInfo - Source file info
     * @param {string} targetBasePath - Target directory
     * @param {ProjectAnalysis} projectAAnalysis - Target project analysis
     * @param {ProjectAnalysis} projectBAnalysis - Source project analysis
     * @returns {Promise<void>}
     */
    async copyAndTransformFile(sourceFileInfo, targetBasePath, projectAAnalysis, projectBAnalysis) {
        const targetFilePath = path.join(targetBasePath, sourceFileInfo.relativePath);
        await fs.mkdir(path.dirname(targetFilePath), { recursive: true });

        let content = await fs.readFile(sourceFileInfo.filePath, 'utf8');
        let transformedContent = content;

        if (['.js', '.jsx', '.ts', '.tsx'].includes(sourceFileInfo.fileExtension)) {
            this.log(`  Processing ${sourceFileInfo.relativePath} with AST transformations`);
            const ast = this._parseCodeToAST(content, sourceFileInfo.filePath);
            if (ast) {
                this._performSemanticAnalysis(ast, sourceFileInfo, projectBAnalysis);
                this._reconstructDependencyGraph(ast, sourceFileInfo, projectBAnalysis);
                this._recognizeArchitecturalPatterns(ast, sourceFileInfo, projectBAnalysis);
                const adaptedAst = this._adaptToTargetConventions(ast, sourceFileInfo, projectAAnalysis, projectBAnalysis);
                transformedContent = generate(adaptedAst, {}, content).code;

                // Apply inline style transformations
                transformedContent = this._transformInlineStyles(transformedContent, sourceFileInfo, projectAAnalysis, projectBAnalysis);
            }
        } else if (['.css', '.scss', '.less'].includes(sourceFileInfo.fileExtension)) {
            this.log(`  Processing ${sourceFileInfo.relativePath} with style transformations`);
            transformedContent = this._applyStyleTransformation(content, sourceFileInfo, projectAAnalysis, projectBAnalysis);
        }

        if (this.options.customFileTransformer) {
            try {
                transformedContent = await this.options.customFileTransformer(transformedContent, sourceFileInfo, projectAAnalysis, projectBAnalysis);
                this.log(`    Applied custom transformation to ${sourceFileInfo.relativePath}`);
            } catch (error) {
                this.log(`    Error applying custom transformation: ${error.message}`, 'error');
            }
        }

        if (!this.options.dryRun) {
            await fs.writeFile(targetFilePath, transformedContent, 'utf8');
            this.log(`  Copied and transformed: ${sourceFileInfo.relativePath} -> ${targetFilePath}`);
        } else {
            this.log(`  DRY RUN: Would copy and transform: ${sourceFileInfo.relativePath} -> ${targetFilePath}`);
        }

        // Generate tests if enabled and file is a component/page
        if (this.options.generateTests && (sourceFileInfo.type === 'component' || sourceFileInfo.type === 'page')) {
            await this._generateComponentTest(sourceFileInfo, targetBasePath);
        }
    }

    /**
     * Migrates components and dependencies, using parallel processing.
     * Enhanced with test generation and conflict resolution.
     * @param {ProjectAnalysis} projectAAnalysis - Target project analysis
     * @param {ProjectAnalysis} projectBAnalysis - Source project analysis
     * @returns {Promise<void>}
     */
    async migrateComponents(projectAAnalysis, projectBAnalysis) {
        this.log("\n✨ Initiating Component Migration");
        const targetComponentBasePath = path.join(projectAAnalysis.rootPath, 'src', 'components_migrated_from_B');
        await fs.mkdir(targetComponentBasePath, { recursive: true });

        const filesToMigrate = [
            ...projectBAnalysis.categorizedFiles.component,
            ...projectBAnalysis.categorizedFiles.page,
            ...projectBAnalysis.categorizedFiles.util,
            ...projectBAnalysis.categorizedFiles.config
        ];

        // Parallelize file migrations for performance
        await Promise.all(filesToMigrate.map(async fileInfo => {
            if (fileInfo.componentName && projectAAnalysis.componentMap[fileInfo.componentName] && !this.options.componentNameMapping[fileInfo.componentName]) {
                const newFileName = `${fileInfo.componentName}B${fileInfo.fileExtension}`;
                fileInfo.relativePath = path.join(path.dirname(fileInfo.relativePath), newFileName);
                this.options.componentNameMapping[fileInfo.componentName] = path.basename(newFileName, fileInfo.fileExtension);
                this.log(`    Renaming '${fileInfo.componentName}' to avoid conflict`, 'warn');
            }

            try {
                await this.copyAndTransformFile(fileInfo, targetComponentBasePath, projectAAnalysis, projectBAnalysis);
            } catch (error) {
                this.log(`    Failed to migrate ${fileInfo.relativePath}: ${error.message}`, 'error');
            }
        }));

        this.log("✨ Component Migration complete");
    }

    /**
     * Harmonizes routing configurations (conceptual, with React Router example).
     * @param {ProjectAnalysis} projectAAnalysis - Target project analysis
     * @param {ProjectAnalysis} projectBAnalysis - Source project analysis
     * @returns {Promise<void>}
     */
    async harmonizeRoutes(projectAAnalysis, projectBAnalysis) {
        this.log("\n🗺️ Harmonizing Routes (React-specific example)");
        if (projectAAnalysis.framework === 'react') {
            const routeSuggestions = projectBAnalysis.categorizedFiles.page.map(page => ({
                path: `/${page.componentName.toLowerCase()}`,
                component: page.componentName
            }));
            this.log("  Suggested routes to add to Project A's router:");
            routeSuggestions.forEach(route => {
                this.log(`    { path: '${route.path}', element: <${route.component} /> }`);
            });
        }
        this.log("🗺️ Route Harmonization complete. Manual integration required.");
    }

    /**
     * Integrates state management logic (conceptual, with Redux example).
     * @param {ProjectAnalysis} projectAAnalysis - Target project analysis
     * @param {ProjectAnalysis} projectBAnalysis - Source project analysis
     * @returns {Promise<void>}
     */
    async integrateStateManagement(projectAAnalysis, projectBAnalysis) {
        this.log("\n🧠 Integrating State Management (Redux example)");
        if (projectBAnalysis.architecturalPatterns.redux) {
            this.log("  Detected Redux in Project B. Suggested actions:");
            this.log("    - Copy Redux store/reducers to Project A's store directory");
            this.log("    - Update action imports to use Project A's conventions");
        }
        this.log("🧠 State Management Integration complete. Manual integration required.");
    }

    /**
     * Generates a rapid prototype based on merged aesthetics.
     * @param {ProjectAnalysis} projectAAnalysis - Target project analysis
     * @param {ProjectAnalysis} projectBAnalysis - Source project analysis
     * @returns {Promise<void>}
     */
    async generatePrototype(projectAAnalysis, projectBAnalysis) {
        this.log("\n✨ Generating Rapid Prototype");
        const protoPath = path.join(this.projectAPath, this.options.prototypeDir);
        await fs.mkdir(protoPath, { recursive: true });

        // Clone A's structure, apply B's aesthetics modularly
        const mergedAnalysis = this._mergeAesthetics(projectAAnalysis, projectBAnalysis);
        await this._renderPrototype(mergedAnalysis, protoPath);

        // Add framework configs (e.g., install packages if needed)
        await this._configurePrototype(protoPath, mergedAnalysis.framework);

        this.log(`Prototype generated at ${protoPath}. Run 'npm start' to preview.`);
    }

    /**
     * Placeholder for merging aesthetics from Project B into Project A.
     * @param {ProjectAnalysis} aAnalysis
     * @param {ProjectAnalysis} bAnalysis
     * @returns {ProjectAnalysis}
     */
    _mergeAesthetics(aAnalysis, bAnalysis) {
        this.log("    Merging aesthetics (placeholder)");
        // Actual implementation will involve deeper analysis and mapping
        return { ...aAnalysis, aestheticProfile: bAnalysis.aestheticProfile };
    }

    /**
     * Placeholder for rendering the prototype files.
     * @param {ProjectAnalysis} mergedAnalysis
     * @param {string} protoPath
     * @returns {Promise<void>}
     */
    async _renderPrototype(mergedAnalysis, protoPath) {
        this.log("    Rendering prototype (placeholder)");
        // Actual implementation will involve writing files based on mergedAnalysis
    }

    /**
     * Placeholder for configuring the prototype (e.g., installing dependencies).
     * @param {string} protoPath
     * @param {string} framework
     * @returns {Promise<void>}
     */
    async _configurePrototype(protoPath, framework) {
        this.log(`    Configuring prototype for ${framework}`);
        const depsToAdd = this._detectMissingDeps(this.projectBAnalysis);
        if (depsToAdd.length) {
            this.log(`      Installing missing dependencies: ${depsToAdd.join(', ')}`);
            try {
                await new Promise((resolve, reject) => {
                    exec(`cd ${protoPath} && npm install ${depsToAdd.join(' ')}`, (err, stdout, stderr) => {
                        if (err) {
                            this.log(`      npm install failed: ${stderr}`, 'error');
                            return reject(err);
                        }
                        this.log(`      npm install stdout: ${stdout}`);
                        resolve();
                    });
                });
            } catch (error) {
                this.log(`      Failed to install dependencies in prototype: ${error.message}`, 'error');
            }
        }

        // Update package.json in the prototype (conceptual)
        try {
            const protoPackageJsonPath = path.join(protoPath, 'package.json');
            let protoPackageJson = {};
            try {
                const content = await fs.readFile(protoPackageJsonPath, 'utf8');
                protoPackageJson = JSON.parse(content);
            } catch (e) {
                this.log(`      No package.json found in prototype, creating one.`, 'warn');
                protoPackageJson = { name: 'prototype-app', version: '1.0.0', private: true, dependencies: {} };
            }

            // Add dependencies from Project B that are not in Project A
            const bDeps = { ...this.projectBAnalysis.packageJson.dependencies, ...this.projectBAnalysis.packageJson.devDependencies };
            const aDeps = { ...this.projectAAnalysis.packageJson.dependencies, ...this.projectAAnalysis.packageJson.devDependencies };

            for (const dep in bDeps) {
                if (!aDeps[dep]) {
                    protoPackageJson.dependencies[dep] = bDeps[dep];
                }
            }

            await fs.writeFile(protoPackageJsonPath, JSON.stringify(protoPackageJson, null, 2), 'utf8');
            this.log(`      Updated package.json in prototype.`);
        } catch (error) {
            this.log(`      Failed to update package.json in prototype: ${error.message}`, 'error');
        }
    }

    /**
     * Detects missing dependencies in Project B compared to Project A.
     * @param {ProjectAnalysis} bAnalysis - Project B's analysis
     * @returns {string[]} - Array of dependency names to add
     */
    _detectMissingDeps(bAnalysis) {
        const missingDeps = [];
        const bDeps = { ...bAnalysis.packageJson.dependencies, ...bAnalysis.packageJson.devDependencies };
        const aDeps = { ...this.projectAAnalysis.packageJson.dependencies, ...this.projectAAnalysis.packageJson.devDependencies };

        for (const dep in bDeps) {
            if (!aDeps[dep]) {
                missingDeps.push(dep);
            }
        }
        return missingDeps;
    }

    /**
     * Compares style information between Project A and Project B and reports findings.
     * This helps in defining style mapping rules.
     * @param {ProjectAnalysis} projectAAnalysis - Target project analysis
     * @param {ProjectAnalysis} projectBAnalysis - Source project analysis
     * @returns {Promise<void>}
     */
    async _compareAndReportStyles(projectAAnalysis, projectBAnalysis) {
        this.log("\n📊 Comparing Styles between Project A and Project B");

        const aStyles = projectAAnalysis.styleInfo;
        const bStyles = projectBAnalysis.styleInfo;

        const report = {
            colors: { common: new Set(), aOnly: new Set(), bOnly: new Set() },
            fontFamilies: { common: new Set(), aOnly: new Set(), bOnly: new Set() },
            fontSizes: { common: new Set(), aOnly: new Set(), bOnly: new Set() },
            properties: { common: new Set(), aOnly: new Set(), bOnly: new Set() }
        };

        // Compare Colors
        const aColors = new Set(Object.values(aStyles).flatMap(s => s.colors || []));
        const bColors = new Set(Object.values(bStyles).flatMap(s => s.colors || []));
        aColors.forEach(color => bColors.has(color) ? report.colors.common.add(color) : report.colors.aOnly.add(color));
        bColors.forEach(color => !aColors.has(color) && report.colors.bOnly.add(color));

        // Compare Font Families
        const aFontFamilies = new Set(Object.values(aStyles).flatMap(s => s.fontFamilies || []));
        const bFontFamilies = new Set(Object.values(bStyles).flatMap(s => s.fontFamilies || []));
        aFontFamilies.forEach(font => bFontFamilies.has(font) ? report.fontFamilies.common.add(font) : report.fontFamilies.aOnly.add(font));
        bFontFamilies.forEach(font => !aFontFamilies.has(font) && report.fontFamilies.bOnly.add(font));

        // Compare Font Sizes
        const aFontSizes = new Set(Object.values(aStyles).flatMap(s => s.fontSizes || []));
        const bFontSizes = new Set(Object.values(bStyles).flatMap(s => s.fontSizes || []));
        aFontSizes.forEach(size => bFontSizes.has(size) ? report.fontSizes.common.add(size) : report.fontSizes.aOnly.add(size));
        bFontSizes.forEach(size => !aFontSizes.has(size) && report.fontSizes.bOnly.add(size));

        // Compare Properties (keys only for now, values would be too granular)
        const aProps = new Set(Object.values(aStyles).flatMap(s => Object.keys(s.properties || {})));
        const bProps = new Set(Object.values(bStyles).flatMap(s => Object.keys(s.properties || {})));
        aProps.forEach(prop => bProps.has(prop) ? report.properties.common.add(prop) : report.properties.aOnly.add(prop));
        bProps.forEach(prop => !aProps.has(prop) && report.properties.bOnly.add(prop));

        this.log("  --- Style Comparison Report ---");
        this.log(`  Colors: Common: ${Array.from(report.colors.common).join(', ') || 'None'}`);
        this.log(`          Project A Only: ${Array.from(report.colors.aOnly).join(', ') || 'None'}`);
        this.log(`          Project B Only: ${Array.from(report.colors.bOnly).join(', ') || 'None'}`);

        this.log(`  Font Families: Common: ${Array.from(report.fontFamilies.common).join(', ') || 'None'}`);
        this.log(`                 Project A Only: ${Array.from(report.fontFamilies.aOnly).join(', ') || 'None'}`);
        this.log(`                 Project B Only: ${Array.from(report.fontFamilies.bOnly).join(', ') || 'None'}`);

        this.log(`  Font Sizes: Common: ${Array.from(report.fontSizes.common).join(', ') || 'None'}`);
        this.log(`              Project A Only: ${Array.from(report.fontSizes.aOnly).join(', ') || 'None'}`);
        this.log(`              Project B Only: ${Array.from(report.fontSizes.bOnly).join(', ') || 'None'}`);

        this.log(`  CSS Properties: Common: ${Array.from(report.properties.common).join(', ') || 'None'}`);
        this.log(`                  Project A Only: ${Array.from(report.properties.aOnly).join(', ') || 'None'}`);
        this.log(`                  Project B Only: ${Array.from(report.properties.bOnly).join(', ') || 'None'}`);

        this.log("  --- End Style Comparison Report ---");
    }

    /**
     * Applies the chosen style transformation strategy to file content.
     * @param {string} content - The file content to transform
     * @param {FileInfo} fileInfo - Information about the file being transformed
     * @param {ProjectAnalysis} projectAAnalysis - Target project analysis
     * @param {ProjectAnalysis} projectBAnalysis - Source project analysis
     * @returns {string} - Transformed content
     */
    _applyStyleTransformation(content, fileInfo, projectAAnalysis, projectBAnalysis) {
        const strategy = this.options.styleTransformationStrategy;
        this.log(`    Applying style transformation strategy: ${strategy} to ${fileInfo.relativePath}`);

        switch (strategy) {
            case 'none':
                return content;
            case 'basic-mapping':
                // Basic color mapping for CSS/SCSS/Less files
                if (['.css', '.scss', '.less'].includes(fileInfo.fileExtension)) {
                    let transformedContent = content;
                    const bColors = new Set(Object.values(projectBAnalysis.styleInfo).flatMap(s => s.colors || []));
                    const aColors = new Set(Object.values(projectAAnalysis.styleInfo).flatMap(s => s.colors || []));

                    // Create a simple mapping: if a color from B is not in A, keep it. Otherwise, no change.
                    // For a more advanced mapping, we'd use color similarity or a predefined mapping.
                    const colorMap = {};
                    bColors.forEach(bColor => {
                        if (!aColors.has(bColor)) {
                            // If B's color is not in A, keep it for now.
                            // Future: find closest color in A, or map to a design token.
                            colorMap[bColor] = bColor;
                        } else {
                            colorMap[bColor] = bColor; // Color exists in A, no transformation needed
                        }
                    });

                    // Re-parse the CSS content to apply transformations
                    const fileExtension = path.extname(fileInfo.filePath).toLowerCase();
                    let syntax = null;
                    if (fileExtension === '.scss') {
                        syntax = require('postcss-scss');
                    }

                    const root = postcss().parse(content, { syntax });

                    root.walkDecls(decl => {
                        if (/(color|background|border)-?/.test(decl.prop) && decl.value.match(/#([a-fA-F0-9]{3}){1,2}|rgb\(\d+,\d+,\d+\)|rgba\(\d+,\d+,\d+,[0-9\.]+\)|hsl\(\d+,\d+%,\d+%\)|hsla\(\d+,\d+%,\d+%,[0-9\.]+\)/)) {
                            if (colorMap[decl.value]) {
                                decl.value = colorMap[decl.value];
                            }
                        }
                    });

                    transformedContent = root.toString();
                    this.log(`      Basic color mapping applied to ${fileInfo.relativePath}.`);
                    return transformedContent;
                }
                return content;
            case 'prefix-styles':
                // Add a prefix to all selectors in CSS/SCSS/Less files
                if (['.css', '.scss', '.less'].includes(fileInfo.fileExtension)) {
                    const prefix = this.options.stylePrefix;
                    const fileExtension = path.extname(fileInfo.filePath).toLowerCase();
                    let syntax = null;
                    if (fileExtension === '.scss') {
                        syntax = require('postcss-scss');
                    }

                    const root = postcss().parse(content, { syntax });

                    root.walkRules(rule => {
                        rule.selector = rule.selector.split(',').map(s => `${prefix}${s.trim()}`).join(', ');
                    });

                    const transformedContent = root.toString();
                    this.log(`      Prefixed styles in ${fileInfo.relativePath} with '${prefix}'.`);
                    return transformedContent;
                }
                return content;
            default:
                this.log(`  Unknown style transformation strategy: ${strategy}`, 'warn');
                return content;
        }
    }

    /**
     * Transforms inline styles within JavaScript/TypeScript files (JSX/TSX).
     * @param {string} code - The source code to transform
     * @param {FileInfo} fileInfo - Information about the file being transformed
     * @param {ProjectAnalysis} projectAAnalysis - Target project analysis
     * @param {ProjectAnalysis} projectBAnalysis - Source project analysis
     * @returns {string} - Transformed code
     */
    _transformInlineStyles(code, fileInfo, projectAAnalysis, projectBAnalysis) {
        const strategy = this.options.styleTransformationStrategy;
        if (strategy === 'none') return code;

        this.log(`    Transforming inline styles in ${fileInfo.relativePath} with strategy: ${strategy}`);

        const plugins = [];
        if (fileInfo.fileExtension.endsWith('.jsx') || fileInfo.fileExtension.endsWith('.tsx')) plugins.push('jsx');
        if (fileInfo.fileExtension.endsWith('.ts') || fileInfo.fileExtension.endsWith('.tsx')) plugins.push('typescript');

        const ast = parser.parse(code, {
            sourceType: 'module',
            plugins
        });

        const bColors = new Set(Object.values(projectBAnalysis.styleInfo).flatMap(s => s.colors || []));
        const aColors = new Set(Object.values(projectAAnalysis.styleInfo).flatMap(s => s.colors || []));

        traverse(ast, {
            JSXAttribute(path) {
                if (path.node.name.name === 'style' && path.node.value.expression.type === 'ObjectExpression') {
                    path.node.value.expression.properties.forEach(prop => {
                        if (prop.value.type === 'StringLiteral') {
                            // Apply basic color mapping to string literal values
                            if (/(color|background|border)-?/.test(prop.key.name || prop.key.value) && bColors.has(prop.value.value)) {
                                if (!aColors.has(prop.value.value)) {
                                    // If B's color is not in A, keep it for now.
                                    // Future: find closest color in A, or map to a design token.
                                    this.log(`      Inline style color '${prop.value.value}' from Project B not found in Project A. Keeping as is.`);
                                }
                            }
                        }
                    });
                }
            }
        });

        return generate(ast, {}, code).code;
    }

    /**
     * Runs the migration process, orchestrating all steps.
     * @returns {Promise<void>}
     */
    async runMigration() {
        this.log("\n--- Starting Hyper-Adaptive Interface Harmonization ---");
        try {
            this.projectAAnalysis = await this.analyzeProjectStructure(this.projectAPath);
            this.projectBAnalysis = await this.analyzeProjectStructure(this.projectBPath);

            if (this.projectAAnalysis.framework !== this.projectBAnalysis.framework) {
                this.log(`🚨 Different frameworks detected (A: ${this.projectAAnalysis.framework}, B: ${this.projectBAnalysis.framework})`, 'warn');
            }

            await this.migrateComponents(this.projectAAnalysis, this.projectBAnalysis);
            await this.harmonizeRoutes(this.projectAAnalysis, this.projectBAnalysis);
            await this.integrateStateManagement(this.projectAAnalysis, this.projectBAnalysis);
            await this._compareAndReportStyles(this.projectAAnalysis, this.projectBAnalysis); // New: Compare and report styles

            if (this.options.outputMode === 'prototype') {
                await this.generatePrototype(this.projectAAnalysis, this.projectBAnalysis);
            } else if (this.options.outputMode === 'diff') {
                this.log("\nDifferences reported. No migration performed in 'diff' mode.");
            }

            this.log("\n--- Migration Complete ---");
        } catch (error) {
            this.log(`Fatal error: ${error.message}`, 'error');
        }
    }
}

/**
 * CLI interface for running the migrator.
 * New feature to enhance usability.
 */
function setupCLI() {
    const program = new commander.Command();
    program
        .version('1.0.0')
        .option('--source <path>', 'Source project path (Project B)')
        .option('--target <path>', 'Target project path (Project A)')
        .option('--dry-run', 'Run without writing files', false)
        .option('--generate-tests', 'Generate test files for components', false)
        .option('--output-mode <mode>', 'Output mode: migrate, prototype, diff', 'migrate')
        .option('--mismatch-strategy <strategy>', 'Handle mismatches: strict, approximate, fallback', 'approximate')
        .option('--aesthetic <profile>', 'Aesthetic profile: auto, minimalist, vibrant', 'auto')
        .action(async (options) => {
            if (!options.source || !options.target) {
                console.error('Error: --source and --target are required');
                process.exit(1);
            }
            const migrator = new FrontendMigrator(options.target, options.source, {
                dryRun: options.dryRun,
                generateTests: options.generateTests,
                outputMode: options.outputMode,
                mismatchStrategy: options.mismatchStrategy,
                aestheticProfile: options.aesthetic,
                customFileTransformer: (content, fileInfo) => {
                    // Example transformer: Add migration comment
                    if (['.js', '.jsx', '.ts', '.tsx'].includes(fileInfo.fileExtension)) {
                        return `// Migrated from ${options.source}\n${content}`;
                    }
                    return content;
                }
            });
            await migrator.runMigration();
        });

    program.parse(process.argv);
}

// Run CLI if invoked directly
if (require.main === module) {
    setupCLI();
}

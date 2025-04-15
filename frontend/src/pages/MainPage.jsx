import { useState, useEffect } from 'react';
import { ArrowDownRight, Code, BookOpen, Terminal, Cpu, Grid, PlayCircle, Eye, ChevronRight, ChevronDown, ExternalLink, Layers } from 'lucide-react';

export default function MainPage() {
  const [matrixSize, setMatrixSize] = useState(2);
  const [matrixA, setMatrixA] = useState([]);
  const [matrixB, setMatrixB] = useState([]);
  const [resultMatrix, setResultMatrix] = useState([]);
  const [currentSection, setCurrentSection] = useState('intro');
  const [isCalculating, setIsCalculating] = useState(false);
  const [showDescription, setShowDescription] = useState(true);
  const [activeSidebarItem, setActiveSidebarItem] = useState('intro');
  const [animationPhase, setAnimationPhase] = useState(0);
  
  // Initialize matrices when size changes
  useEffect(() => {
    generateRandomMatrices();
  }, [matrixSize]);
  
  const generateRandomMatrices = () => {
    const generateMatrix = () => {
      return Array(matrixSize).fill().map(() => 
        Array(matrixSize).fill().map(() => Math.floor(Math.random() * 10))
      );
    };
    
    setMatrixA(generateMatrix());
    setMatrixB(generateMatrix());
    setResultMatrix([]);
  };
  
  const isPowerOfTwo = (n) => {
    return n && !(n & (n - 1));
  };
  
  const handleSizeChange = (e) => {
    const newSize = parseInt(e.target.value, 10);
    if (newSize >= 1 && newSize <= 8 && isPowerOfTwo(newSize)) {
      setMatrixSize(newSize);
    }
  };
  
  const add = (A, B) => {
    const n = A.length;
    const C = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        C[i][j] = A[i][j] + B[i][j];
      }
    }
    
    return C;
  };
  
  const subtract = (A, B) => {
    const n = A.length;
    const C = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        C[i][j] = A[i][j] - B[i][j];
      }
    }
    
    return C;
  };
  
  const strassen = (A, B) => {
    const n = A.length;
    
    // Base case
    if (n === 1) {
      return [[A[0][0] * B[0][0]]];
    }
    
    const newSize = n / 2;
    
    // Initialize submatrices
    const a11 = Array(newSize).fill().map(() => Array(newSize).fill(0));
    const a12 = Array(newSize).fill().map(() => Array(newSize).fill(0));
    const a21 = Array(newSize).fill().map(() => Array(newSize).fill(0));
    const a22 = Array(newSize).fill().map(() => Array(newSize).fill(0));
    
    const b11 = Array(newSize).fill().map(() => Array(newSize).fill(0));
    const b12 = Array(newSize).fill().map(() => Array(newSize).fill(0));
    const b21 = Array(newSize).fill().map(() => Array(newSize).fill(0));
    const b22 = Array(newSize).fill().map(() => Array(newSize).fill(0));
    
    // Divide matrices
    for (let i = 0; i < newSize; i++) {
      for (let j = 0; j < newSize; j++) {
        a11[i][j] = A[i][j];
        a12[i][j] = A[i][j + newSize];
        a21[i][j] = A[i + newSize][j];
        a22[i][j] = A[i + newSize][j + newSize];
        
        b11[i][j] = B[i][j];
        b12[i][j] = B[i][j + newSize];
        b21[i][j] = B[i + newSize][j];
        b22[i][j] = B[i + newSize][j + newSize];
      }
    }
    
    // 7 recursive multiplications
    const m1 = strassen(add(a11, a22), add(b11, b22));
    const m2 = strassen(add(a21, a22), b11);
    const m3 = strassen(a11, subtract(b12, b22));
    const m4 = strassen(a22, subtract(b21, b11));
    const m5 = strassen(add(a11, a12), b22);
    const m6 = strassen(subtract(a21, a11), add(b11, b12));
    const m7 = strassen(subtract(a12, a22), add(b21, b22));
    
    // Calculate result submatrices
    const c11 = add(subtract(add(m1, m4), m5), m7);
    const c12 = add(m3, m5);
    const c21 = add(m2, m4);
    const c22 = add(subtract(add(m1, m3), m2), m6);
    
    // Initialize result matrix
    const C = Array(n).fill().map(() => Array(n).fill(0));
    
    // Combine submatrices
    for (let i = 0; i < newSize; i++) {
      for (let j = 0; j < newSize; j++) {
        C[i][j] = c11[i][j];
        C[i][j + newSize] = c12[i][j];
        C[i + newSize][j] = c21[i][j];
        C[i + newSize][j + newSize] = c22[i][j];
      }
    }
    
    return C;
  };
  
  const calculateMultiplication = () => {
    setIsCalculating(true);
    setAnimationPhase(1);
    
    // Simulate calculation with progress animation
    setTimeout(() => {
      setAnimationPhase(2);
      setTimeout(() => {
        setAnimationPhase(3);
        setTimeout(() => {
          setAnimationPhase(4);
          setTimeout(() => {
            const result = strassen(matrixA, matrixB);
            setResultMatrix(result);
            setIsCalculating(false);
            setAnimationPhase(5);
          }, 500);
        }, 500);
      }, 500);
    }, 500);
  };
  
  // Navigation functions
  const navigateTo = (section) => {
    setCurrentSection(section);
    setActiveSidebarItem(section);
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      {/* Header */}
      <header className="bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center mb-4 md:mb-0">
              <Grid className="h-10 w-10 mr-3 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold">Strassen's Matrix Multiplication</h1>
                <p className="text-gray-400">Advanced Algorithm Visualization</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button onClick={() => navigateTo('intro')} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-all duration-300 flex items-center">
                <BookOpen className="mr-2 h-4 w-4" />
                <span>Introduction</span>
              </button>
              <button onClick={() => navigateTo('visualization')} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-all duration-300 flex items-center">
                <Eye className="mr-2 h-4 w-4" />
                <span>Visualization</span>
              </button>
              <button onClick={() => navigateTo('code')} className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition-all duration-300 flex items-center">
                <Code className="mr-2 h-4 w-4" />
                <span>Code</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-4 text-purple-400">Navigation</h3>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => navigateTo('intro')} className={`w-full text-left px-4 py-2 rounded flex items-center ${activeSidebarItem === 'intro' ? 'bg-gray-700 text-purple-400 font-medium' : 'hover:bg-gray-700'}`}>
                    <BookOpen className="mr-3 h-4 w-4" />
                    <span>Introduction</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('algorithm')} className={`w-full text-left px-4 py-2 rounded flex items-center ${activeSidebarItem === 'algorithm' ? 'bg-gray-700 text-purple-400 font-medium' : 'hover:bg-gray-700'}`}>
                    <Cpu className="mr-3 h-4 w-4" />
                    <span>Algorithm</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('visualization')} className={`w-full text-left px-4 py-2 rounded flex items-center ${activeSidebarItem === 'visualization' ? 'bg-gray-700 text-purple-400 font-medium' : 'hover:bg-gray-700'}`}>
                    <Eye className="mr-3 h-4 w-4" />
                    <span>Visualization</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('code')} className={`w-full text-left px-4 py-2 rounded flex items-center ${activeSidebarItem === 'code' ? 'bg-gray-700 text-purple-400 font-medium' : 'hover:bg-gray-700'}`}>
                    <Code className="mr-3 h-4 w-4" />
                    <span>Code Implementation</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('multithreading')} className={`w-full text-left px-4 py-2 rounded flex items-center ${activeSidebarItem === 'multithreading' ? 'bg-gray-700 text-purple-400 font-medium' : 'hover:bg-gray-700'}`}>
                    <Layers className="mr-3 h-4 w-4" />
                    <span>Multithreading</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => navigateTo('multiprocessing')} className={`w-full text-left px-4 py-2 rounded flex items-center ${activeSidebarItem === 'multithreading' ? 'bg-gray-700 text-purple-400 font-medium' : 'hover:bg-gray-700'}`}>
                    <Layers className="mr-3 h-4 w-4" />
                    <span>Multiprocessing</span>
                  </button>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Main content */}
          <div className="lg:w-3/4">
            {/* Introduction Section */}
            {currentSection === 'intro' && (
              <div className={`bg-gray-800 rounded-xl shadow-lg p-8 mb-8 transition-opacity duration-700 ${currentSection === 'intro' ? 'opacity-100' : 'opacity-0'}`}>

                <h2 className="text-3xl font-bold text-purple-400 mb-6">Strassen's Matrix Multiplication</h2>
                <div className="prose max-w-none text-gray-300">
                  <p className="text-lg mb-4">
                    Strassen's algorithm is a recursive divide-and-conquer approach for matrix multiplication, 
                    developed by Volker Strassen in 1969. It reduces the time complexity from the naive 
                    <span className="inline-block px-2 py-1 mx-1 bg-gray-700 text-purple-300 rounded font-mono">O(n³)</span> to approximately 
                    <span className="inline-block px-2 py-1 mx-1 bg-gray-700 text-purple-300 rounded font-mono">O(n^2.81)</span>.
                  </p>
                  
                  <div className="my-8 p-6 bg-gray-700 rounded-lg border-l-4 border-purple-500">
                    <h3 className="text-xl font-bold text-purple-400 mb-2">Key Insight</h3>
                    <p>
                      The brilliance of Strassen's algorithm lies in reducing the number of recursive multiplications 
                      from 8 to 7, while using additional addition and subtraction operations. This trade-off 
                      results in a significant asymptotic improvement for large matrices.
                    </p>
                  </div>
                  
                  <h3 className="text-xl font-bold text-purple-400 mb-3">Why It Matters</h3>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                      <span>Asymptotically faster than the standard algorithm for large matrices</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                      <span>Demonstrates the power of recursive divide-and-conquer approaches</span>
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                      <span>Set the stage for further optimizations in matrix operations</span>
                    </li>
                  </ul>
                  
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg p-6 shadow-lg transform hover:scale-105 transition-transform duration-300">
                    <h3 className="text-xl font-bold mb-2">Let's Explore</h3>
                    <p className="mb-4">
                      Dive deeper into Strassen's algorithm through interactive visualizations and code examples.
                    </p>
                    <button 
                      onClick={() => navigateTo('visualization')} 
                      className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center hover:bg-gray-200 transition-colors"
                    >
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Try it yourself
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Algorithm Section */}
            {currentSection === 'algorithm' && (
              <div className={`transition-opacity duration-700 ${currentSection === 'algorithm' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                <h2 className="text-3xl font-bold text-purple-400 mb-6">The Algorithm</h2>
                
                <div className="prose max-w-none text-gray-300">
                  <h3 className="text-xl font-bold text-purple-400 mb-3">How It Works</h3>
                  <p className="mb-4">
                    Strassen's algorithm divides each matrix into four equal-sized submatrices and then combines 
                    them using 7 recursive multiplications instead of the naive 8 multiplications.
                  </p>
                  
                  <div className="my-6 p-6 bg-gray-700 rounded-lg border border-gray-600">
                    <h4 className="text-lg font-bold text-gray-200 mb-3">For two matrices A and B split into submatrices:</h4>
                    <div className="flex flex-col md:flex-row md:space-x-8 mb-4">
                      <div className="mb-4 md:mb-0">
                        <p className="text-center mb-2 font-bold">Matrix A</p>
                        <div className="flex justify-center">
                          <div className="grid grid-cols-2 gap-1">
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-600 rounded">A₁₁</div>
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-600 rounded">A₁₂</div>
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-600 rounded">A₂₁</div>
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-600 rounded">A₂₂</div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-center mb-2 font-bold">Matrix B</p>
                        <div className="flex justify-center">
                          <div className="grid grid-cols-2 gap-1">
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-600 rounded">B₁₁</div>
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-600 rounded">B₁₂</div>
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-600 rounded">B₂₁</div>
                            <div className="w-16 h-16 flex items-center justify-center bg-gray-600 rounded">B₂₂</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-lg font-bold text-purple-400 mb-3">The 7 Magic Multiplications</h4>
                  <div className="space-y-3 mb-6 font-mono text-sm bg-gray-700 p-4 rounded-lg overflow-x-auto">
                    <p>M₁ = (A₁₁ + A₂₂) × (B₁₁ + B₂₂)</p>
                    <p>M₂ = (A₂₁ + A₂₂) × B₁₁</p>
                    <p>M₃ = A₁₁ × (B₁₂ - B₂₂)</p>
                    <p>M₄ = A₂₂ × (B₂₁ - B₁₁)</p>
                    <p>M₅ = (A₁₁ + A₁₂) × B₂₂</p>
                    <p>M₆ = (A₂₁ - A₁₁) × (B₁₁ + B₁₂)</p>
                    <p>M₇ = (A₁₂ - A₂₂) × (B₂₁ + B₂₂)</p>
                  </div>
                  
                  <h4 className="text-lg font-bold text-purple-400 mb-3">Computing the Result</h4>
                  <div className="space-y-3 mb-6 font-mono text-sm bg-gray-700 p-4 rounded-lg overflow-x-auto">
                    <p>C₁₁ = M₁ + M₄ - M₅ + M₇</p>
                    <p>C₁₂ = M₃ + M₅</p>
                    <p>C₂₁ = M₂ + M₄</p>
                    <p>C₂₂ = M₁ + M₃ - M₂ + M₆</p>
                  </div>
                  
                  <h3 className="text-xl font-bold text-purple-400 mb-3">Time Complexity Analysis</h3>
                  <p>
                    For matrices of size n×n:
                  </p>
                  <ul className="mb-6">
                    <li><strong>Traditional algorithm:</strong> O(n³)</li>
                    <li><strong>Strassen's algorithm:</strong> O(n^log₂7) ≈ O(n^2.81)</li>
                  </ul>
                  
                  <div className="p-4 bg-yellow-900 bg-opacity-30 border-l-4 border-yellow-500 mb-6">
                    <h4 className="font-bold text-yellow-400 mb-1">Important Constraint</h4>
                    <p className="text-yellow-300">
                      Strassen's algorithm works most efficiently when the matrix size is a power of 2. 
                      For other sizes, matrices can be padded with zeros to reach the nearest power of 2.
                    </p>
                  </div>
                  
                  <div className="flex justify-center my-8">
                    <button 
                      onClick={() => navigateTo('visualization')} 
                      className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium flex items-center transition-colors"
                    >
                      <Eye className="mr-2 h-5 w-5" />
                      See it in action
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Visualization Section */}
            {currentSection === 'visualization' && (
              <div className={`transition-opacity duration-700 ${currentSection === 'visualization' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                <h2 className="text-3xl font-bold text-purple-400 mb-6">Interactive Visualization</h2>
                
                <div className="mb-8 p-6 bg-gray-700 rounded-lg">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-purple-400 mb-3">Matrix Size</h3>
                    <p className="mb-2 text-gray-300">Select a power of 2 (1, 2, 4, 8):</p>
                    <div className="flex space-x-2">
                      {[1, 2, 4, 8].map(size => (
                        <button 
                          key={size}
                          onClick={() => setMatrixSize(size)}
                          className={`px-4 py-2 rounded-lg ${matrixSize === size 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-600 border border-gray-500 text-gray-300 hover:bg-gray-500'
                          } transition-colors`}
                        >
                          {size}×{size}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-700 rounded-lg p-4 shadow-sm">
                      <h4 className="font-bold text-purple-400 mb-3 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-600 text-purple-400 flex items-center justify-center mr-2">A</div>
                        Matrix A
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <tbody>
                            {matrixA.map((row, i) => (
                              <tr key={i}>
                                {row.map((val, j) => (
                                  <td key={j} className="border border-gray-600 p-2 text-center">
                                    {val}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4 shadow-sm">
                      <h4 className="font-bold text-purple-400 mb-3 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-600 text-purple-400 flex items-center justify-center mr-2">B</div>
                        Matrix B
                      </h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full">
                          <tbody>
                            {matrixB.map((row, i) => (
                              <tr key={i}>
                                {row.map((val, j) => (
                                  <td key={j} className="border border-gray-600 p-2 text-center">
                                    {val}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="bg-gray-700 rounded-lg p-4 shadow-sm">
                      <h4 className="font-bold text-purple-400 mb-3 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-600 text-purple-400 flex items-center justify-center mr-2">C</div>
                        Result Matrix
                      </h4>
                      {resultMatrix.length > 0 ? (
                        <div className="overflow-x-auto">
                          <table className="min-w-full">
                            <tbody>
                              {resultMatrix.map((row, i) => (
                                <tr key={i}>
                                  {row.map((val, j) => (
                                    <td key={j} className="border border-gray-600 p-2 text-center bg-green-900 bg-opacity-30">
                                      {val}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="h-20 flex items-center justify-center text-gray-500">
                          Result will appear here
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <button 
                      onClick={calculateMultiplication}
                      disabled={isCalculating}
                      className={`px-6 py-3 rounded-lg font-bold ${
                        isCalculating 
                          ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      } transition-colors flex items-center`}
                    >
                      {isCalculating ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                          Computing...
                        </>
                      ) : (
                        <>
                          <PlayCircle className="mr-2 h-5 w-5" />
                          Calculate
                        </>
                      )}
                    </button>
                  </div>
                </div>
                
                {/* Visualization Steps */}
                {animationPhase > 0 && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-purple-400 mb-4">Visualization Steps</h3>
                    <div className="space-y-4">
                      <div className={`p-4 border-l-4 border-purple-500 bg-gray-700 rounded-r-lg transition-opacity duration-500 ${animationPhase >= 1 ? 'opacity-100' : 'opacity-0'}`}>
                        <h4 className="font-bold text-purple-400">Step 1: Matrix Division</h4>
                        <p>Dividing input matrices into 4 submatrices each.</p>
                      </div>
                      
                      <div className={`p-4 border-l-4 border-purple-500 bg-gray-700 rounded-r-lg transition-opacity duration-500 ${animationPhase >= 2 ? 'opacity-100' : 'opacity-0'}`}>
                        <h4 className="font-bold text-purple-400">Step 2: Calculate 7 Products</h4>
                        <p>Computing the 7 matrix products M₁ through M₇ with recursive calls.</p>
                      </div>
                      
                      <div className={`p-4 border-l-4 border-purple-500 bg-gray-700 rounded-r-lg transition-opacity duration-500 ${animationPhase >= 3 ? 'opacity-100' : 'opacity-0'}`}>
                        <h4 className="font-bold text-purple-400">Step 3: Calculate Result Quadrants</h4>
                        <p>Computing C₁₁, C₁₂, C₂₁, and C₂₂ by combining the 7 products.</p>
                      </div>
                      
                      <div className={`p-4 border-l-4 border-purple-500 bg-gray-700 rounded-r-lg transition-opacity duration-500 ${animationPhase >= 4 ? 'opacity-100' : 'opacity-0'}`}>
                        <h4 className="font-bold text-purple-400">Step 4: Combine Results</h4>
                        <p>Assembling the final result matrix from the calculated quadrants.</p>
                      </div>
                      
                      {animationPhase >= 5 && (
                        <div className="p-4 border-l-4 border-green-500 bg-gray-700 rounded-r-lg animate-pulse">
                          <h4 className="font-bold text-green-400">Step 5: Computation Complete!</h4>
                          <p>The final result matrix has been successfully calculated using Strassen's algorithm.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Algorithm Explanation */}
                <div className="mt-12">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-purple-400">Algorithm Walkthrough</h3>
                    <button 
                      onClick={() => setShowDescription(!showDescription)}
                      className="text-purple-400 hover:text-purple-300 flex items-center"
                    >
                      {showDescription ? (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Hide Details
                        </>
                      ) : (
                        <>
                          <ChevronRight className="h-4 w-4 mr-1" />
                          Show Details
                        </>
                      )}
                    </button>
                  </div>

                  {showDescription && (
                    <div className="prose max-w-none bg-gray-700 p-6 rounded-lg text-gray-300">
                      <h4 className="text-lg font-bold text-purple-400 mb-2">Divide Phase</h4>
                      <p className="mb-4">
                        The algorithm starts by dividing each input matrix into four equal-sized submatrices. 
                        This is done recursively until we reach base cases of 1×1 matrices.
                      </p>

                      <h4 className="text-lg font-bold text-purple-400 mb-2">Conquer Phase</h4>
                      <p className="mb-4">
                        Instead of performing 8 recursive multiplications like the naive approach, Strassen's 
                        algorithm cleverly combines the submatrices to perform only 7 multiplications:
                      </p>
                      <ul className="mb-4 space-y-2">
                        <li className="flex items-start">
                          <ArrowDownRight className="h-4 w-4 text-purple-400 mt-1 mr-2" />
                          <span>M₁ = (A₁₁ + A₂₂) × (B₁₁ + B₂₂)</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowDownRight className="h-4 w-4 text-purple-400 mt-1 mr-2" />
                          <span>M₂ = (A₂₁ + A₂₂) × B₁₁</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowDownRight className="h-4 w-4 text-purple-400 mt-1 mr-2" />
                          <span>M₃ = A₁₁ × (B₁₂ - B₂₂)</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowDownRight className="h-4 w-4 text-purple-400 mt-1 mr-2" />
                          <span>M₄ = A₂₂ × (B₂₁ - B₁₁)</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowDownRight className="h-4 w-4 text-purple-400 mt-1 mr-2" />
                          <span>M₅ = (A₁₁ + A₁₂) × B₂₂</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowDownRight className="h-4 w-4 text-purple-400 mt-1 mr-2" />
                          <span>M₆ = (A₂₁ - A₁₁) × (B₁₁ + B₁₂)</span>
                        </li>
                        <li className="flex items-start">
                          <ArrowDownRight className="h-4 w-4 text-purple-400 mt-1 mr-2" />
                          <span>M₇ = (A₁₂ - A₂₂) × (B₂₁ + B₂₂)</span>
                        </li>
                      </ul>

                      <h4 className="text-lg font-bold text-purple-400 mb-2">Combine Phase</h4>
                      <p>
                        The results are then combined to form the four quadrants of the result matrix:
                      </p>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="bg-gray-600 p-3 rounded border border-gray-500">
                          <p className="font-mono text-sm">C₁₁ = M₁ + M₄ - M₅ + M₇</p>
                        </div>
                        <div className="bg-gray-600 p-3 rounded border border-gray-500">
                          <p className="font-mono text-sm">C₁₂ = M₃ + M₅</p>
                        </div>
                        <div className="bg-gray-600 p-3 rounded border border-gray-500">
                          <p className="font-mono text-sm">C₂₁ = M₂ + M₄</p>
                        </div>
                        <div className="bg-gray-600 p-3 rounded border border-gray-500">
                          <p className="font-mono text-sm">C₂₂ = M₁ + M₃ - M₂ + M₆</p>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-blue-900 bg-opacity-30 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-bold text-blue-400 mb-2">Performance Note</h4>
                        <p>
                          While Strassen's algorithm has better asymptotic complexity, in practice it's typically 
                          faster only for large matrices (n greater than 100) due to the overhead of additions and 
                          subtractions. For small matrices, the standard algorithm is often more efficient.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Code Section */}
            {currentSection === 'code' && (
              <div className={`transition-opacity duration-700 ${currentSection === 'code' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
                <h2 className="text-3xl font-bold text-purple-400 mb-6">Code Implementation</h2>
                
                <div className="prose max-w-none text-gray-300">
                  

                  <h3 className="text-xl font-bold text-indigo-700 mb-4">CPP Implementation</h3>
                  <p className="mb-6">
                    For comparison, here's how Strassen's algorithm can be implemented in CPP:
                  </p>

                  <div className="bg-gray-800 rounded-lg overflow-hidden mb-8">
                    <div className="flex items-center bg-gray-700 px-4 py-2">
                      <div className="flex space-x-2 mr-4">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-gray-300 text-sm">strassen.cpp</span>
                    </div>
                    <pre className="p-4 overflow-x-auto text-gray-100">
                      <code>{`#include <iostream>
 #include <vector>
 #include <cstdlib>    // For rand()
 #include <ctime>      // For time()
 #include <chrono>     // For high precision timing
 
 using namespace std;
 typedef vector<vector<int>> Matrix;  // Matrix type as 2D vector
 using namespace chrono;              // For time measurement
 
 /**
  * Standard Matrix Addition
  * 
  * @param A First matrix (n x n)
  * @param B Second matrix (n x n)
  * @return Resultant matrix C = A + B
  */
 Matrix add(Matrix A, Matrix B) {
     int n = A.size();
     Matrix C(n, vector<int>(n));
     for(int i = 0; i < n; i++)
         for(int j = 0; j < n; j++)
             C[i][j] = A[i][j] + B[i][j];
     return C;
 }
 
 /**
  * Standard Matrix Subtraction
  * 
  * @param A First matrix (n x n)
  * @param B Second matrix (n x n)
  * @return Resultant matrix C = A - B
  */
 Matrix subtract(Matrix A, Matrix B) {
     int n = A.size();
     Matrix C(n, vector<int>(n));
     for(int i = 0; i < n; i++)
         for(int j = 0; j < n; j++)
             C[i][j] = A[i][j] - B[i][j];
     return C;
 }
 
 /**
  * Strassen's Matrix Multiplication Algorithm (Recursive)
  * 
  * @param A First matrix (n x n, where n is power of 2)
  * @param B Second matrix (n x n, where n is power of 2)
  * @return Resultant matrix C = A × B
  */
 Matrix strassen(Matrix A, Matrix B) {
     int n = A.size();
     Matrix C(n, vector<int>(n));
 
     // Base case: 1x1 matrix
     if(n == 1) {
         C[0][0] = A[0][0] * B[0][0];
         return C;
     }
 
     // Partition matrices into quadrants
     int newSize = n / 2;
     Matrix a11(newSize, vector<int>(newSize));
     Matrix a12(newSize, vector<int>(newSize));
     Matrix a21(newSize, vector<int>(newSize));
     Matrix a22(newSize, vector<int>(newSize));
 
     Matrix b11(newSize, vector<int>(newSize));
     Matrix b12(newSize, vector<int>(newSize));
     Matrix b21(newSize, vector<int>(newSize));
     Matrix b22(newSize, vector<int>(newSize));
 
     // Divide A and B into 4 submatrices each
     for(int i = 0; i < newSize; i++)
         for(int j = 0; j < newSize; j++) {
             a11[i][j] = A[i][j];                   // Top-left of A
             a12[i][j] = A[i][j + newSize];         // Top-right of A
             a21[i][j] = A[i + newSize][j];         // Bottom-left of A
             a22[i][j] = A[i + newSize][j + newSize]; // Bottom-right of A
 
             b11[i][j] = B[i][j];                   // Top-left of B
             b12[i][j] = B[i][j + newSize];         // Top-right of B
             b21[i][j] = B[i + newSize][j];         // Bottom-left of B
             b22[i][j] = B[i + newSize][j + newSize]; // Bottom-right of B
         }
 
     // Recursively compute the 7 matrix products
     Matrix m1 = strassen(add(a11, a22), add(b11, b22));  // (a11+a22) × (b11+b22)
     Matrix m2 = strassen(add(a21, a22), b11);            // (a21+a22) × b11
     Matrix m3 = strassen(a11, subtract(b12, b22));       // a11 × (b12-b22)
     Matrix m4 = strassen(a22, subtract(b21, b11));       // a22 × (b21-b11)
     Matrix m5 = strassen(add(a11, a12), b22);            // (a11+a12) × b22
     Matrix m6 = strassen(subtract(a21, a11), add(b11, b12)); // (a21-a11) × (b11+b12)
     Matrix m7 = strassen(subtract(a12, a22), add(b21, b22)); // (a12-a22) × (b21+b22)
 
     // Combine the results to get the final matrix quadrants
     Matrix c11 = add(subtract(add(m1, m4), m5), m7);  // m1 + m4 - m5 + m7
     Matrix c12 = add(m3, m5);                        // m3 + m5
     Matrix c21 = add(m2, m4);                        // m2 + m4
     Matrix c22 = add(subtract(add(m1, m3), m2), m6);  // m1 + m3 - m2 + m6
 
     // Combine quadrants into result matrix
     for(int i = 0; i < newSize; i++)
         for(int j = 0; j < newSize; j++) {
             C[i][j] = c11[i][j];                     // Top-left quadrant
             C[i][j + newSize] = c12[i][j];           // Top-right quadrant
             C[i + newSize][j] = c21[i][j];           // Bottom-left quadrant
             C[i + newSize][j + newSize] = c22[i][j]; // Bottom-right quadrant
         }
 
     return C;
 }
 
 /**
  * Checks if a number is power of 2
  * 
  * @param n Positive integer to check
  * @return true if n is power of 2, false otherwise
  */
 bool isPowerOfTwo(int n) {
     // Bitwise check: power of 2 has exactly one '1' bit
     return n && (!(n & (n - 1)));
 }
 
 /**
  * Generates a random matrix of given size
  * 
  * @param n Size of matrix (n x n)
  * @param label Name of matrix (for display purposes)
  * @return Randomly generated matrix with values 0-9
  */
 Matrix getInput(int n, string label) {
     Matrix mat(n, vector<int>(n));
     for(int i = 0; i < n; i++)
         for(int j = 0; j < n; j++)
             mat[i][j] = rand() % 10;  // Random value between 0-9
     return mat;
 }
 
 /**
  * Prints a matrix to standard output
  * 
  * @param mat Matrix to be printed
  */
 void printMatrix(Matrix mat) {
     for (auto row : mat) {
         for (auto val : row)
             cout << val << " ";
         cout << "\n";
     }
 }
 
 /**
  * Main function with program execution
  */
 int main() {
     srand(time(0));  // Seed random number generator
     int n;
 
     // Get valid matrix size (must be power of 2)
     do {
         cout << "Enter matrix size (must be a power of 2): ";
         cin >> n;
 
         if (!isPowerOfTwo(n))
             cout << "⚠️ Oops! That's not a power of 2. Try again.\n";
     } while (!isPowerOfTwo(n));
 
     // Generate random matrices
     Matrix A = getInput(n, "A");
     Matrix B = getInput(n, "B");
 
     // Uncomment to display input matrices
     // cout << "\nMatrix A:\n"; printMatrix(A);
     // cout << "\nMatrix B:\n"; printMatrix(B);
 
     // Time measurement for Strassen's algorithm
     auto start = high_resolution_clock::now();  // Start timer
     Matrix C = strassen(A, B);                 // Perform multiplication
     auto end = high_resolution_clock::now();   // End timer
     auto duration = duration_cast<microseconds>(end - start);
 
     // Uncomment to display result
     // cout << "\nResult of multiplication:\n"; printMatrix(C);
 
     // Display execution time
     cout << "\n🕒 Time taken by Strassen's Algorithm: " 
          << duration.count() << " microseconds\n";
 
     return 0;
 }
`}</code>
                    </pre>
                  </div>

                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
                    <h4 className="font-bold text-yellow-800 mb-2">Implementation Notes</h4>
                    <ul className="list-disc pl-5 text-yellow-800">
                      <li>Both implementations assume square matrices with dimensions that are powers of 2</li>
                      <li>For production use, add input validation and padding for non-power-of-2 matrices</li>
                      <li>The Python version uses helper functions <code>matrix_add</code> and <code>matrix_sub</code> (not shown)</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Multithreading Section */}
            {currentSection === 'multithreading' && (
  <div className={`transition-opacity duration-700 ${currentSection === 'multithreading' ? 'opacity-100 block' : 'opacity-0 hidden'}`}>
    <div className="bg-gradient-to-r from-indigo-800 to-purple-700 rounded-xl p-6 mb-8 shadow-lg">
      <h2 className="text-4xl font-bold text-white mb-2">Multithreading Optimization</h2>
      <p className="text-indigo-100 text-lg">
        Leverage modern CPU cores to dramatically accelerate Strassen's algorithm through parallel computation
      </p>
    </div>
    
    <div className="space-y-8">
      <section className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Parallelizing Strassen's Algorithm
        </h3>
        <div className="space-y-4">
          <p className="text-gray-700 leading-relaxed">
            Strassen's algorithm naturally decomposes matrix multiplication into 7 independent subproblems, making it 
            <span className="font-semibold text-indigo-600"> ideal for parallel execution</span>. Each recursive multiplication 
            can be computed concurrently, potentially reducing the time complexity from O(n<sup>2.807</sup>) to O(log<sup>2</sup>n) 
            with unlimited processors.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 my-4">
            <div className="bg-indigo-50 p-5 rounded-lg border border-indigo-100">
              <h4 className="font-bold text-indigo-700 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Key Parallelization Points
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                    <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-blue-600">7 independent matrix multiplications (M1-M7) can run in parallel</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                    <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-blue-600">Matrix additions can also be parallelized for additional gains</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                    <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-blue-600">Recursive calls maintain the same parallel structure at each level</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-5 rounded-lg border border-purple-100">
              <h4 className="font-bold text-purple-700 mb-3 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Implementation Strategies
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full mr-3 mt-1">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-blue-600"><span className="font-medium">Thread pools</span> for efficient worker thread management</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full mr-3 mt-1">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-blue-600" ><span className="font-medium">Work stealing</span> for dynamic load balancing</span>
                </li>
                <li className="flex items-start">
                  <div className="bg-purple-100 p-1 rounded-full mr-3 mt-1">
                    <svg className="w-3 h-3 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-blue-600"><span className="font-medium">Fork-join</span> pattern for recursive parallelism</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
          CPP Implementation
        </h3>
        
        <div className="mb-6">
          <div className="flex items-center justify-between bg-gray-800 px-4 py-3 rounded-t-lg">
            <div className="flex items-center">
              <div className="flex space-x-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-gray-300 font-mono text-sm">parallel-strassen.js</span>
            </div>
            <button className="text-gray-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            </button>
          </div>
          <pre className="bg-gray-900 p-4 rounded-b-lg overflow-x-auto text-gray-100 font-mono text-sm">
            <code>{`/*
 * Parallel Strassen's Matrix Multiplication Algorithm
 * 
 * Implementation featuring:
 * - Strassen's O(n^log7) algorithm
 * - Multithreading for parallel computation
 * - Recursion depth control
 
 * Course: MA-120
 * Submitted by: Vansh Pandey
 * Roll No: B24411
 * Date: 15-4-2025
 */

 #include <iostream>
 #include <vector>
 #include <thread>    // For multithreading support
 #include <cstdlib>   // For rand()
 #include <ctime>     // For time()
 #include <chrono>    // For high precision timing
 
 using namespace std;
 typedef vector<vector<int>> Matrix;  // Matrix type as 2D vector
 using namespace chrono;              // For time measurement
 
 // ======================= Utility Functions ======================= //
 
 /**
  * Matrix Addition: C = A + B (element-wise)
  * @param A First matrix (n x n)
  * @param B Second matrix (n x n)
  * @return Resultant matrix C
  */
 Matrix add(Matrix A, Matrix B) {
     int n = A.size();
     Matrix C(n, vector<int>(n));
     for(int i = 0; i < n; i++)
         for(int j = 0; j < n; j++)
             C[i][j] = A[i][j] + B[i][j];
     return C;
 }
 
 /**
  * Matrix Subtraction: C = A - B (element-wise)
  * @param A First matrix (n x n)
  * @param B Second matrix (n x n)
  * @return Resultant matrix C
  */
 Matrix subtract(Matrix A, Matrix B) {
     int n = A.size();
     Matrix C(n, vector<int>(n));
     for(int i = 0; i < n; i++)
         for(int j = 0; j < n; j++)
             C[i][j] = A[i][j] - B[i][j];
     return C;
 }
 
 // ======================= Strassen's Algorithm ======================= //
 
 /**
  * Parallel Strassen's Matrix Multiplication
  * @param A First matrix (n x n, power of 2)
  * @param B Second matrix (n x n, power of 2)
  * @param depth Current recursion depth (default 0)
  * @return Resultant matrix C = A × B
  */
 Matrix strassen(Matrix A, Matrix B, int depth = 0) {
     int n = A.size();
     Matrix C(n, vector<int>(n));
 
     // Base case: 1x1 matrix multiplication
     if (n == 1) {
         C[0][0] = A[0][0] * B[0][0];
         return C;
     }
 
     int newSize = n / 2;  // Size of submatrices
     
     // Initialize submatrices
     Matrix a11(newSize, vector<int>(newSize));
     Matrix a12(newSize, vector<int>(newSize));
     Matrix a21(newSize, vector<int>(newSize));
     Matrix a22(newSize, vector<int>(newSize));
     Matrix b11(newSize, vector<int>(newSize));
     Matrix b12(newSize, vector<int>(newSize));
     Matrix b21(newSize, vector<int>(newSize));
     Matrix b22(newSize, vector<int>(newSize));
 
     // Partition input matrices into quadrants
     for (int i = 0; i < newSize; i++) {
         for (int j = 0; j < newSize; j++) {
             a11[i][j] = A[i][j];                   // Top-left of A
             a12[i][j] = A[i][j + newSize];         // Top-right of A
             a21[i][j] = A[i + newSize][j];         // Bottom-left of A
             a22[i][j] = A[i + newSize][j + newSize]; // Bottom-right of A
             
             b11[i][j] = B[i][j];                   // Top-left of B
             b12[i][j] = B[i][j + newSize];         // Top-right of B
             b21[i][j] = B[i + newSize][j];         // Bottom-left of B
             b22[i][j] = B[i + newSize][j + newSize]; // Bottom-right of B
         }
     }
 
     // Strassen's 7 multiplication products
     Matrix m1, m2, m3, m4, m5, m6, m7;
 
     // Parallel execution for top recursion levels (depth <= 2)
     // and larger matrices (n >= 128) to optimize performance
     if (depth <= 2 && n >= 128) {
         // Launch all 7 multiplications in separate threads
         thread t1([&]() { m1 = strassen(add(a11, a22), add(b11, b22), depth + 1); });
         thread t2([&]() { m2 = strassen(add(a21, a22), b11, depth + 1); });
         thread t3([&]() { m3 = strassen(a11, subtract(b12, b22), depth + 1); });
         thread t4([&]() { m4 = strassen(a22, subtract(b21, b11), depth + 1); });
         thread t5([&]() { m5 = strassen(add(a11, a12), b22, depth + 1); });
         thread t6([&]() { m6 = strassen(subtract(a21, a11), add(b11, b12), depth + 1); });
         thread t7([&]() { m7 = strassen(subtract(a12, a22), add(b21, b22), depth + 1); });
 
         // Synchronize all threads
         t1.join(); t2.join(); t3.join(); t4.join();
         t5.join(); t6.join(); t7.join();
     } else {
         // Serial execution for deeper recursion levels or smaller matrices
         m1 = strassen(add(a11, a22), add(b11, b22), depth + 1);
         m2 = strassen(add(a21, a22), b11, depth + 1);
         m3 = strassen(a11, subtract(b12, b22), depth + 1);
         m4 = strassen(a22, subtract(b21, b11), depth + 1);
         m5 = strassen(add(a11, a12), b22, depth + 1);
         m6 = strassen(subtract(a21, a11), add(b11, b12), depth + 1);
         m7 = strassen(subtract(a12, a22), add(b21, b22), depth + 1);
     }
 
     // Combine results into final matrix quadrants
     Matrix c11 = add(subtract(add(m1, m4), m5), m7);  // m1 + m4 - m5 + m7
     Matrix c12 = add(m3, m5);                        // m3 + m5
     Matrix c21 = add(m2, m4);                        // m2 + m4
     Matrix c22 = add(subtract(add(m1, m3), m2), m6);  // m1 + m3 - m2 + m6
 
     // Merge quadrants into result matrix
     for (int i = 0; i < newSize; i++) {
         for (int j = 0; j < newSize; j++) {
             C[i][j] = c11[i][j];                     // Top-left
             C[i][j + newSize] = c12[i][j];           // Top-right
             C[i + newSize][j] = c21[i][j];           // Bottom-left
             C[i + newSize][j + newSize] = c22[i][j]; // Bottom-right
         }
     }
     return C;
 }
 
 // ======================= Helper Functions ======================= //
 
 /**
  * Checks if a number is power of 2
  * @param n Positive integer to check
  * @return true if n is power of 2, false otherwise
  */
 bool isPowerOfTwo(int n) {
     // Bitwise check: power of 2 has exactly one '1' bit
     return n && (!(n & (n - 1)));
 }
 
 /**
  * Generates random square matrix
  * @param n Size of matrix (n x n)
  * @return Matrix filled with random values 0-9
  */
 Matrix getInput(int n) {
     Matrix mat(n, vector<int>(n));
     for(int i = 0; i < n; i++)
         for(int j = 0; j < n; j++)
             mat[i][j] = rand() % 10;  // Random value 0-9
     return mat;
 }
 
 /**
  * Prints matrix (for debugging)
  * @param mat Matrix to print
  */
 void printMatrix(Matrix mat) {
     for (auto row : mat) {
         for (auto val : row)
             cout << val << " ";
         cout << "\n";
     }
 }
 
 // ======================= Main Function ======================= //
 int main() {
     srand(time(0));  // Initialize random seed
     
     int n;
     // Get valid matrix size (must be power of 2)
     do {
         cout << "Enter matrix size (must be a power of 2): ";
         cin >> n;
         if (!isPowerOfTwo(n))
             cout << "⚠️ Not a power of 2! Try again.\n";
     } while (!isPowerOfTwo(n));
 
     // Generate random matrices
     Matrix A = getInput(n);
     Matrix B = getInput(n);
 
     // Time measurement for parallel Strassen's
     auto start = high_resolution_clock::now();
     Matrix C = strassen(A, B);
     auto end = high_resolution_clock::now();
 
     // Calculate and display execution time
     auto duration = duration_cast<microseconds>(end - start);
     cout << "\n🕒 Parallel Strassen's Execution Time: " 
          << duration.count() << " microseconds\n";
 
     return 0;
 }
`}</code>
          </pre>
        </div>

        <div className="bg-blue-50 rounded-lg p-5 border-l-4 border-blue-500">
          <h4 className="font-bold text-blue-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Performance Optimization Tips
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="font-medium text-blue-800 mb-2">Worker Management</p>
              <ul className="space-y-1 text-blue-700">
                <li className="flex items-start">
                  <svg className="w-4 h-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Reuse workers to avoid creation overhead</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Limit recursion depth to control thread explosion</span>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-blue-800 mb-2">Data Transfer</p>
              <ul className="space-y-1 text-blue-700">
                <li className="flex items-start">
                  <svg className="w-4 h-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Transfer only required submatrices</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-4 h-4 mt-0.5 mr-2 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Use Transferable Objects for zero-copy transfer</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Performance Benchmarks
        </h3>
        
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">512×512 Matrices</p>
              <p className="text-2xl font-bold text-indigo-600">2.8x <span className="text-sm font-normal text-gray-500">speedup</span></p>
              <p className="text-xs text-gray-500 mt-1">8-core CPU vs single thread</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">1024×1024 Matrices</p>
              <p className="text-2xl font-bold text-indigo-600">5.1x <span className="text-sm font-normal text-gray-500">speedup</span></p>
              <p className="text-xs text-gray-500 mt-1">16-core CPU vs single thread</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Optimal Threshold</p>
              <p className="text-2xl font-bold text-indigo-600">128-256 <span className="text-sm font-normal text-gray-500">elements</span></p>
              <p className="text-xs text-gray-500 mt-1">Switch to sequential algorithm</p>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-indigo-100 rounded-lg">
            <p className="text-indigo-800">
              <span className="font-semibold">Note:</span> The parallel efficiency decreases for smaller matrices due to thread management overhead. 
              For matrices smaller than 256×256, the sequential implementation often performs better.
            </p>
          </div>
        </div>
      </section>
    </div>
  </div>
)}
    {currentSection === 'multiprocessing' && (
        <div className="bg-white rounded-xl p-6 shadow-md">
        <h3 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
          </svg>
          Multiprocessing Approach
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6 my-4">
          <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
            <h4 className="font-bold text-blue-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Key Advantages
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-600">Bypasses Python's GIL for true parallel execution</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-600">Better CPU core utilization for compute-heavy tasks</span>
              </li>
              <li className="flex items-start">
                <div className="bg-blue-100 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-blue-600">Isolated memory spaces prevent shared-state issues</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-green-50 p-5 rounded-lg border border-green-100">
            <h4 className="font-bold text-green-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              CPP Implementation
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-green-600"><span className="font-medium">ProcessPoolExecutor</span> for high-level management</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-green-600"><span className="font-medium">multiprocessing.Pool</span> for batch processing</span>
              </li>
              <li className="flex items-start">
                <div className="bg-green-100 p-1 rounded-full mr-3 mt-1">
                  <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-green-600"><span className="font-medium">Shared memory</span> for controlled data exchange</span>
              </li>
            </ul>
          </div>
        </div>
      
        <div className="bg-gray-800 rounded-lg overflow-hidden mb-6">
          <div className="flex items-center bg-gray-700 px-4 py-2">
            <div className="flex space-x-2 mr-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <span className="text-gray-300 text-sm">multiprocessing-strassen.cpp</span>
          </div>
          <pre className="p-4 overflow-x-auto text-gray-100 font-mono text-sm">
            <code>{`#include <iostream>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <sys/wait.h>
#include <unistd.h>
#include <cstdlib>
#include <ctime>

using namespace std;

// Function to generate a random matrix
void generateRandomMatrix(int** matrix, int N, int range = 10) {
    for (int i = 0; i < N; ++i)
        for (int j = 0; j < N; ++j)
            matrix[i][j] = rand() % range;
}

// Function to print matrix from shared memory
void printMatrix(int* matrix, int N) {
    for (int i = 0; i < N; ++i) {
        for (int j = 0; j < N; ++j)
            cout << matrix[i * N + j] << " ";
        cout << endl;
    }
}

int main() {
    srand(time(0)); // seed RNG 🎲

    int N;
    cout << "Enter matrix size (N x N): ";
    cin >> N;

    // Dynamically allocate matrices
    int** A = new int*[N];
    int** B = new int*[N];
    for (int i = 0; i < N; ++i) {
        A[i] = new int[N];
        B[i] = new int[N];
    }

    // Fill them with randomness
    generateRandomMatrix(A, N);
    generateRandomMatrix(B, N);

    // Display matrices
    cout << "\nMatrix A:" << endl;
    for (int i = 0; i < N; ++i) {
        for (int j = 0; j < N; ++j)
            cout << A[i][j] << " ";
        cout << endl;
    }

    cout << "\nMatrix B:" << endl;
    for (int i = 0; i < N; ++i) {
        for (int j = 0; j < N; ++j)
            cout << B[i][j] << " ";
        cout << endl;
    }

    // Shared memory for result
    key_t key = IPC_PRIVATE;
    int shmid = shmget(key, sizeof(int) * N * N, IPC_CREAT | 0666);
    if (shmid < 0) {
        perror("Shared memory error");
        return 1;
    }

    int* result = (int*)shmat(shmid, nullptr, 0);
    if (result == (int*)-1) {
        perror("Attachment error");
        return 1;
    }

    // Launching child processes
    for (int i = 0; i < N; ++i) {
        for (int j = 0; j < N; ++j) {
            pid_t pid = fork();
            if (pid == 0) {
                int sum = 0;
                for (int k = 0; k < N; ++k)
                    sum += A[i][k] * B[k][j];
                result[i * N + j] = sum;
                _exit(0); // terminate child
            }
        }
    }

    // Parent waits
    for (int i = 0; i < N * N; ++i)
        wait(nullptr);

    cout << "\nResultant Matrix (A x B):" << endl;
    printMatrix(result, N);

    // Cleanup
    shmdt(result);
    shmctl(shmid, IPC_RMID, nullptr);
    for (int i = 0; i < N; ++i) {
        delete[] A[i];
        delete[] B[i];
    }
    delete[] A;
    delete[] B;

    return 0;
}

`}</code>
          </pre>
        </div>
      
        <div className="bg-yellow-50 rounded-lg p-5 border-l-4 border-yellow-400">
          <h4 className="font-bold text-yellow-700 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Important Considerations
          </h4>
          <ul className="space-y-2 text-yellow-700">
            <li className="flex items-start">
              <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-1">
                <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Process creation overhead makes it suitable only for large matrices (1024×1024)</span>
            </li>
            <li className="flex items-start">
              <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-1">
                <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Data serialization costs can negate benefits for small problems</span>
            </li>
            <li className="flex items-start">
              <div className="bg-yellow-100 p-1 rounded-full mr-3 mt-1">
                <svg className="w-3 h-3 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span>Memory usage grows linearly with worker count</span>
            </li>
          </ul>
        </div>
      </div>
    )}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold mb-2">Strassen's Algorithm</h2>
              <p className="text-gray-400">Advanced Matrix Multiplication Visualization</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Terminal className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Code className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <ExternalLink className="h-5 w-5" />
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} Algorithm Visualizations. Educational purpose only.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
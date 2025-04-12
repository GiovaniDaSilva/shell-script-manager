import React, { useState, useEffect } from 'react';
import { Terminal, Play, FileCode2, FolderSearch, Save } from 'lucide-react';

interface ShellScript {
  name: string;
  path: string;
}

function App() {
  const [scripts, setScripts] = useState<ShellScript[]>([]);
  const [error, setError] = useState<string>('');
  const [executing, setExecuting] = useState<string | null>(null);
  const [scriptPath, setScriptPath] = useState<string>(() => {
    return localStorage.getItem('scriptPath') || '/home/user/scripts';
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempPath, setTempPath] = useState(scriptPath);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    scanDirectory();
  }, [scriptPath]);

  const scanDirectory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/scripts?path=${encodeURIComponent(scriptPath)}`);
      if (!response.ok) {
        throw new Error('Failed to scan directory');
      }
      const data = await response.json();
      setScripts(data);
      setError('');
    } catch (err) {
      setError(`Failed to scan directory: ${scriptPath}`);
      setScripts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeScript = async (script: ShellScript) => {
    setExecuting(script.name);
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: script.path }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to execute script');
      }
      
      const result = await response.json();
      alert(`Script executed successfully: ${result.output}`);
    } catch (err) {
      setError(`Failed to execute ${script.name}`);
    } finally {
      setExecuting(null);
    }
  };

  const handleSavePath = () => {
    localStorage.setItem('scriptPath', tempPath);
    setScriptPath(tempPath);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Terminal className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">Shell Script Manager</h1>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
            >
              <FolderSearch className="h-5 w-5 mr-2" />
              Configure Path
            </button>
          </div>
          
          {isEditing && (
            <div className="mt-4 flex items-center gap-4">
              <input
                type="text"
                value={tempPath}
                onChange={(e) => setTempPath(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Enter scripts directory path"
              />
              <button
                onClick={handleSavePath}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Path
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6">
          <p className="text-sm text-gray-600">
            Current directory: <span className="font-medium">{scriptPath}</span>
          </p>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Scanning directory...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {scripts.map((script) => (
              <div
                key={script.path}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto">
                    <FileCode2 className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">
                    {script.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 text-center truncate">
                    {script.path}
                  </p>
                  <button
                    onClick={() => executeScript(script)}
                    disabled={executing === script.name}
                    className={`mt-4 w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                      ${
                        executing === script.name
                          ? 'bg-indigo-400 cursor-not-allowed'
                          : 'bg-indigo-600 hover:bg-indigo-700'
                      }`}
                  >
                    {executing === script.name ? (
                      'Executing...'
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Execute
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && scripts.length === 0 && !error && (
          <div className="text-center py-12">
            <FileCode2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No scripts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              No shell scripts were found in the specified directory.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
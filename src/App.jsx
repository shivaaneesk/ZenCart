import React from 'react';
import CommandBar from './components/CommandBar';

function App() {
  return (
    <div className="w-full max-w-[1200px] flex flex-col items-center justify-center duration-700 ease-in-out transition-all">
      <h1 className="text-5xl font-medium tracking-tight text-center mb-12 text-zinc-200">
        ZenCart
      </h1>
      <CommandBar />
    </div>
  );
}

export default App;

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Sidebar from './components/Sidebar/Sidebar';
import Calendar from './components/Calendar/Calendar';

function App() {
  return (
    <BrowserRouter>
      <div className="App h-screen flex overflow-hidden bg-gray-50 text-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-hidden flex flex-col">
          <Calendar />
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;

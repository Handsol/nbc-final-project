// "use client";

// import { useState } from "react";
// import { Suspense } from "react";
// import Header from "./components/Header";
// import TodoForm from "./components/TodoForm";
// import TodoList from "./components/TodoList";
// import AuthProvider from "./providers/AuthProvider";

// export default function Home() {
//   const [refreshTrigger, setRefreshTrigger] = useState(0);

//   const handleTodoAdded = () => {
//     // refreshTrigger를 변경하여 TodoList 리렌더링 트리거
//     setRefreshTrigger((prev) => prev + 1);
//   };

//   return (
//     <AuthProvider>
//       <main className="min-h-screen bg-gray-50">
//         <Header />

//         <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
//           <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
//             할 일 관리 앱
//           </h1>

//           <Suspense fallback={<div className="text-center">로딩 중...</div>}>
//             <TodoForm onAdd={handleTodoAdded} />
//             <TodoList key={refreshTrigger} />
//           </Suspense>
//         </div>
//       </main>
//     </AuthProvider>
//   );
// }

'use client';

import { useState } from 'react';
import { Suspense } from 'react';
import Header from './components/Header';
import HabitForm from './components/HabitForm';
import HabitList from './components/HabitList';
import AuthProvider from './providers/AuthProvider';

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleHabitAdded = () => {
    // refreshTrigger를 변경하여 HabitList 리렌더링 트리거
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <AuthProvider>
      <main className="min-h-screen bg-gray-50">
        <Header />

        <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            습관 관리 앱
          </h1>

          <Suspense fallback={<div className="text-center">로딩 중...</div>}>
            <HabitForm onAdd={handleHabitAdded} />
            <HabitList key={refreshTrigger} />
          </Suspense>
        </div>
      </main>
    </AuthProvider>
  );
}

import React, { useReducer, useContext, useEffect, useRef } from 'react';

const Todo = ({ id, text, isComplete }) => {
  const dispatch = useContext(TodoContext);

  return (
    <div>
      <input type='checkbox' checked={isComplete} onChange={() => dispatch({ type: 'complete', payload: id })}></input>
      <input type='text' defaultValue={text}></input>
      <button onClick={() => dispatch({ type: 'delete', payload: id })}>Delete</button>
    </div>
  );
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'reset': {
      return action.payload;
    }
    case 'add': {
      return {
        ...state,
        todos: [...state.todos, {
          id: Date.now(),
          text: action.payload,
          isComplete: false,
        }],
      }
    }
    case 'delete': {
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      }
    }
    case 'complete': {
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === action.payload) {
            return {
              ...todo,
              isComplete: !todo.isComplete,
            }
          } else {
            return todo;
          }
        }),
      }
    }
    default: {
      return state;
    }
  };
};

const TodoContext = React.createContext();

const useEffectOnce = (cb) => {
  const didRun = useRef(false);

  useEffect(() => {
    if (!didRun.current) {
      cb();
      didRun.current = true;
    }
  })
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, { todos: [] });

  useEffectOnce(() => {
    const raw = localStorage.getItem('data');
    dispatch({ type: 'reset', payload: JSON.parse(raw) })
  });

  useEffect(() => localStorage.setItem('data', JSON.stringify(state)), [state])

  return (
    <TodoContext.Provider value={dispatch}>
      <h1>Todo List</h1>
      <button onClick={() => dispatch({ type: 'add' })}>New Todo</button>
      {state.todos.map((todo) => <Todo key={todo.id} {...todo}/>)}
    </TodoContext.Provider>
  );
};

export default App;

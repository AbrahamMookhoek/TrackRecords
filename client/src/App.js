import React from 'react';
import Modal from 'react-modal';
import Calendar from './Components/Calendar';

// below line refers to the <div id="root"> in 
Modal.setAppElement('#root')

function App() {
  return (
    <Calendar />
  );
}

export default App;

import { ReactNode, createContext, useState } from 'react';


export const StateContext = createContext({
  userDetails: '',
  setUserDetails: () => {}, // default
  showNavBar: false,
  setShowNavBar: () => {},
  showCategories: false,
  setShowCategories: () => {},
  currentTerm: '',
  setCurrentTerm: () => {},

});

export const StateProvider = ( {children} ) => {
  const [userDetails, setUserDetails] = useState('');
  const [currentTerm, setCurrentTerm] = useState('');
  const [showNavBar, setShowNavBar] = useState(true);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <StateContext.Provider value={{userDetails, setUserDetails, showNavBar, setShowNavBar, showCategories, setShowCategories,currentTerm, setCurrentTerm}}>  
      {children}
    </StateContext.Provider>
  );
}



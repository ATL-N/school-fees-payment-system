import { ReactNode, createContext, useState } from 'react';


export const StateContext = createContext({
  userDetails: '',
  setUserDetails: () => {}, // default
  showNavBar: false,
  setShowNavBar: () => {},
  showCategories: false,
  setShowCategories: () => {},

});

export const StateProvider = ( {children} ) => {
  const [userDetails, setUserDetails] = useState('');
  const [showNavBar, setShowNavBar] = useState(true);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <StateContext.Provider value={{userDetails, setUserDetails, showNavBar, setShowNavBar, showCategories, setShowCategories}}>  
      {children}
    </StateContext.Provider>
  );
}



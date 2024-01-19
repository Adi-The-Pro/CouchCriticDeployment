import { useCallback, useEffect, useRef, useState } from "react";

/*This custom hook provides us a way to use the useState hook in a manner that allows us to execute a callback
function after the state has been updated 
*/
export const useStateWithCallback = (initialState) => {
  const [state, setState] = useState(initialState);
  const cbRef = useRef(null);

  /*This is the function that we have passed from the this hook which will be used later the main work of 
  this func is to provide us a with a way to perform one more task along with updating the state*/
  const updateState = useCallback((newState, cb) => {
    cbRef.current = cb;
    setState((prev) => 
    typeof newState === 'function' ? newState(prev) : newState
    );
  },[]);
  // We can pass anything from the callback func from whereve we use this customHook
  // The setState function is then called, updating the state based on the type of newState(function or value)/ 
  useEffect(() =>{
    if(cbRef.current){
      cbRef.current(state);
      cbRef.current = null;
    }
  },[state]);

  //return state and update state function and notice not setState function
  return [state,updateState];
};



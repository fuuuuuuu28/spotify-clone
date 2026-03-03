"use client"
import { useEffect, useState } from "react";

export function useDebounce<T>(value:T, deplay=300){
  const [debounce, setDebounce] = useState(value);
  useEffect(() =>{
    const timer = setTimeout(() => setDebounce(value),deplay);
    return () => clearTimeout(timer);
  },[value,deplay])
  return debounce;
}
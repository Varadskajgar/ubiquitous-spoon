"use client";
import { useState } from "react";
import { GoogleAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, firebaseConfigured } from "@/lib/firebase";
export default function AuthPanel() {
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [message,setMessage]=useState("");
  async function run(fn:()=>Promise<unknown>) { try { if(!auth) throw new Error("Firebase config missing."); await fn(); setMessage("Signed in successfully."); } catch(e) { setMessage(e instanceof Error?e.message:"Authentication failed."); } }
  if(!firebaseConfigured) return <p className="notice">Firebase is not configured. Add Firebase web settings to Website/.env.local.</p>;
  return <div className="panel auth">
    <h2>Welcome back</h2><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)}/>
    <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}/>
    <button onClick={()=>run(()=>signInWithEmailAndPassword(auth!,email,password))}>Sign in</button>
    <button className="light" onClick={()=>run(()=>createUserWithEmailAndPassword(auth!,email,password))}>Create account</button>
    <button className="light" onClick={()=>run(()=>signInWithPopup(auth!,new GoogleAuthProvider()))}>Continue with Google</button>
    <small>{message}</small>
  </div>;
}

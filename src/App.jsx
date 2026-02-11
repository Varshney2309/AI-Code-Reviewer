import React, { useState } from 'react'
import "./App.css"
import Navbar from './components/Navbar'
import Editor from '@monaco-editor/react';
import Select from 'react-select';
// import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown'
import RingLoader from "react-spinners/RingLoader";


const App = () => {
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'rust', label: 'Rust' },
    { value: 'dart', label: 'Dart' },
    { value: 'scala', label: 'Scala' },
    { value: 'perl', label: 'Perl' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'r', label: 'R' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'bash', label: 'Bash' }
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#18181b', // dark background (similar to bg-zinc-900)
      borderColor: '#3f3f46',
      color: '#fff',
      width: "100%"
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#18181b', // dropdown bg
      color: '#fff',
      width: "100%"
    }),
    singleValue: (provided) => ({
      ...provided,
      color: '#fff',  // selected option text
      width: "100%"
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#27272a' : '#18181b',  // hover effect
      color: '#fff',
      cursor: 'pointer',
      // width: "30%"
    }),
    input: (provided) => ({
      ...provided,
      color: '#fff',
      width: "100%"
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#a1a1aa',  // placeholder text color
      width: "100%"
    }),
  };

  const [code, setCode] = useState("");

//   const openai = new OpenAI({
//   apiKey: import.meta.env.VITE_OPENAI_API_KEY,
//   dangerouslyAllowBrowser: true, // ⚠️ required for frontend
// }); 
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  
    const reviewCode = async () => {
  if (!code.trim()) {
    setResponse("Please enter code first.");
    return;
  }

  if (loading) return;

  try {
    setLoading(true);
    setResponse("");

    const res = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek/deepseek-r1",
          messages: [
            {
  role: "system",
  content: `
You are an expert senior software engineer and professional code auditor.

When analyzing code, provide a structured response with the following sections:

### 1️⃣ Purpose
Explain what the code is intended to do.

### 2️⃣ How It Works
Step-by-step explanation of internal logic.

### 3️⃣ Bugs & Logical Issues
Identify errors, incorrect logic, or risky patterns.

### 4️⃣ Edge Cases
Mention scenarios the code does not handle.

### 5️⃣ Performance Analysis
Discuss efficiency and optimization opportunities.

### 6️⃣ Security Risks
Point out vulnerabilities (if any).

### 7️⃣ Code Quality Improvements
Suggest best practices and readability improvements.

### 8️⃣ Refactored Version
Provide a clean, improved version of the full code.

Be precise, technical, and structured.
`
},
            {
              role: "user",
              content: `Review this code:\n\n${code}`,
            },
          ],
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error?.message || "API Error");
    }

    setResponse(data.choices[0].message.content);

  } catch (error) {
    console.error(error);
    setResponse("❌ Error or rate limit exceeded.");
  } finally {
    setLoading(false);
  }
};
  


  return (
    <>
      <Navbar />
      <div className="main flex justify-between" style={{ height: "calc(100vh - 90px" }}>
        <div className="left h-[87.5%] w-[50%]">
          <div className="tabs !mt-5 !px-5 !mb-3 w-full flex items-center gap-[10px]">
            <Select
              value={selectedOption}
              onChange={(e) => { setSelectedOption(e) }}
              options={options}
              styles={customStyles}
            />
            {/* <button className="btnNormal bg-zinc-900 min-w-[120px] transition-all hover:bg-zinc-800">Fix Code</button> */}
            <button onClick={reviewCode} disabled={loading}>
  {loading ? "Reviewing..." : "Review Code"}
</button>
          </div>

          <Editor height="100%" theme='vs-dark' language={selectedOption.value} value={code} onChange={(e) => { setCode(e) }} />
        </div>

        <div className="right overflow-scroll !p-[10px] bg-zinc-900 w-[50%] h-[101%]">
          <div className="topTab border-b-[1px] border-t-[1px] border-[#27272a] flex items-center justif-between h-[60px]">
            <p className='font-[700] text-[17px]'>Response</p>
          </div>
          {loading && <RingLoader color='#9333ea'/>}
          <Markdown>{response}</Markdown>
        </div>
      </div>
    </>
  )
}

export default App
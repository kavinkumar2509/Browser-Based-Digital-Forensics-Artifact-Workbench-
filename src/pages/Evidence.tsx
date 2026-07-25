import { generateMockForensicLog } from '../utils/artifactGenerator';

// Inside your component render logic:
<button 
  onClick={() => {
    const testFile = generateMockForensicLog(5); // Generates a 5MB file instantly
    console.log("Generated test file:", testFile.name, testFile.size);
    // Pass testFile directly into your client-side parsing pipeline!
  }}
  className="px-4 py-2 bg-cyan-600 text-white font-mono rounded hover:bg-cyan-500 transition-colors"
>
  Generate & Test 5MB Artifact
</button>
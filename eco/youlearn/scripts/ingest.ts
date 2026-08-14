import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { loadEnvConfig } from '@next/env';
import { GoogleGenAI } from '@google/genai';

// Load environment variables from .env.local
loadEnvConfig(process.cwd());

const apiKey = process.env.GOOGLE_API_KEY || process.env.GOOGLE_AGENT_API_KEY;
if (!apiKey) {
  console.error('❌ Error: GOOGLE_API_KEY or GOOGLE_AGENT_API_KEY is not defined in .env.local');
  process.exit(1);
}

// Initialize Gemini SDK
const ai = new GoogleGenAI({ apiKey });

// Parse URL argument
const args = process.argv.slice(2);
let videoUrl = '';
for (const arg of args) {
  if (arg.startsWith('--url=')) {
    videoUrl = arg.split('=')[1];
  }
}
if (!videoUrl && args.length > 0) {
  videoUrl = args[0];
}

if (!videoUrl) {
  console.error('\n❌ Error: YouTube URL is required.');
  console.error('Usage: npm run youlearn:ingest <YOUTUBE_URL> or npm run youlearn:ingest -- --url="<YOUTUBE_URL>"\n');
  process.exit(1);
}

async function runIngest() {
  const tmpDir = path.join(process.cwd(), 'tmp_youlearn');
  if (!fs.existsSync(tmpDir)) {
    fs.mkdirSync(tmpDir, { recursive: true });
  }

  // ---------------------------------------------------------------------------
  // PHASE 1: Run Python transcript and metadata extractor
  // ---------------------------------------------------------------------------
  console.log(`\n==================================================`);
  console.log(`🎬 PHASE 1: Extracting transcript & metadata from YouTube...`);
  console.log(`URL: ${videoUrl}`);
  console.log(`==================================================\n`);

  // Detect local virtual environment python executable or fallback to default python
  let pythonCmd = 'python';
  if (process.platform === 'win32') {
    const winVenv = path.join(process.cwd(), '.venv', 'Scripts', 'python.exe');
    if (fs.existsSync(winVenv)) {
      pythonCmd = `"${winVenv}"`;
    }
  } else {
    const unixVenv = path.join(process.cwd(), '.venv', 'bin', 'python');
    if (fs.existsSync(unixVenv)) {
      pythonCmd = `"${unixVenv}"`;
    }
  }

  const extractScript = path.join(process.cwd(), '.agent', 'skills', 'ag47-youlearn-skill', 'scripts', 'extract_youtube.py');
  
  try {
    const extractCmd = `${pythonCmd} "${extractScript}" "${videoUrl}" "${tmpDir}"`;
    console.log(`Executing: ${extractCmd}`);
    const extractOutput = execSync(extractCmd, { encoding: 'utf-8' });
    const extractResult = JSON.parse(extractOutput);
    
    if (extractResult.status !== 'SUCCESS') {
      throw new Error(extractResult.message || 'Python extraction failed');
    }

    const videoId = extractResult.videoId;
    console.log(`\n✅ Transcript Extracted successfully!`);
    console.log(`- Video ID: ${videoId}`);
    console.log(`- Title: ${extractResult.title}`);
    console.log(`- Author: ${extractResult.author}`);
    console.log(`- Duration: ${extractResult.durationMinutes} min`);
    console.log(`- Caption Snippets: ${extractResult.rawSnippets}`);
    console.log(`- Segment count: ${extractResult.segmentsCount}`);

    // Load extracted raw JSON data
    const rawDataPath = path.join(tmpDir, `${videoId}_data.json`);
    const rawData = JSON.parse(fs.readFileSync(rawDataPath, 'utf-8'));

    // ---------------------------------------------------------------------------
    // PHASE 2: Synthesize structured pedagogical KnowledgeObject using Gemini 2.5 Pro
    // ---------------------------------------------------------------------------
    console.log(`\n==================================================`);
    console.log(`🧠 PHASE 2: Compiling pedagogical KnowledgeObject with Gemini...`);
    console.log(`==================================================\n`);

    const segmentsText = rawData.semanticSegments.map((seg: any) => `[${seg.timestampDisplay}] ${seg.text}`).join('\n');

    const prompt = `
You are a Creative Director and Expert Pedagogical Synthesizer for the YouLearn ecosystem.
Your task is to analyze the provided YouTube video transcript and metadata, and compile a high-density, visual-rich pedagogical learning object matching the exact specifications of the YouLearn KnowledgeObject schema.

Input Metadata:
- Video ID: ${rawData.videoId}
- Title: ${rawData.metadata.title}
- Author: ${JSON.stringify(rawData.metadata.author)}
- Duration: ${rawData.metadata.durationMinutes} minutes
- Published At: ${rawData.metadata.publishedAt}
- Chapters: ${JSON.stringify(rawData.metadata.chapters)}

Transcript Segments:
${segmentsText}

Output Schema Structure:
Provide a single JSON object with the following fields:
1. "id": "ko-<slug>-<unique_id>" (e.g. "ko-how-transformers-work-001")
2. "slug": a clean url-friendly slug (e.g. "how-transformers-work")
3. "version": "1.0.0"
4. "title": a premium, high-converting learning title in Portuguese (matching the original video topic)
5. "subtitle": a strategic subtitle in Portuguese summarizing the value proposition
6. "description": a paragraph in Portuguese summarizing the course/video content
7. "category": choose one of ["AI", "Programming", "Business", "Science", "Design", "Finance", "Productivity", "Philosophy", "Technology"]
8. "topics": array of 3-5 main topics (in English or Portuguese as appropriate)
9. "tags": array of 4-6 keyword tags
10. "featured": false
11. "thumbnail": "https://img.youtube.com/vi/${rawData.videoId}/maxresdefault.jpg"
12. "source": {
      "type": "youtube",
      "title": "${rawData.metadata.title}",
      "url": "https://www.youtube.com/watch?v=${rawData.videoId}",
      "author": {
         "name": "${rawData.metadata.author.name}",
         "channelOrOrg": "${rawData.metadata.author.channelOrOrg || ''}",
         "avatarUrl": "${rawData.metadata.author.avatarUrl || ''}",
         "profileUrl": "${rawData.metadata.author.profileUrl || ''}",
         "roleOrBio": "Content Creator"
      },
      "publishedAt": "${rawData.metadata.publishedAt || ''}",
      "platformIdentifier": "${rawData.videoId}",
      "license": "Standard YouTube License"
    }
13. "learning": {
      "originalDurationMinutes": ${rawData.metadata.durationMinutes},
      "estimatedLearningMinutes": [calculate high-compression reading time, typically 80-90% shorter than original duration, e.g. 5-10 minutes],
      "difficulty": "beginner" | "intermediate" | "advanced",
      "keyTakeawaysSummary": "1-sentence summary of the main outcome in Portuguese",
      "targetAudience": ["audience 1", "audience 2"],
      "prerequisites": ["prereq 1"]
    }
14. "createdAt": "${new Date().toISOString()}"
15. "updatedAt": "${new Date().toISOString()}"
16. "status": "published"
17. "sections": Array of sections. You MUST compile a rich array of 6-8 sections of different types to ensure maximum visual and interactive density. 
    ALL textual content within sections (except headings/topics where English is more appropriate) MUST be written in Portuguese.
    Each section in the array must have:
    - "id": a unique section ID (e.g. "sec-overview", "sec-timeline", "sec-concept-1", "sec-process-1", "sec-insight-1", "sec-quiz", "sec-takeaways", "sec-provenance")
    - "type": "overview" | "timeline" | "concept" | "process" | "comparison" | "insight" | "quiz" | "takeaways" | "provenance"
    - "title": a premium title for the section (in Portuguese)
    - "subtitle": optional subtitle (in Portuguese)
    - "content": the section content object.
    
    Specific Content formats per section type:
    
    A. Type "overview":
       "content": {
         "executiveSummary": "string summary",
         "coreThesis": "string thesis",
         "whyItMatters": "string justification",
         "prerequisites": ["string"],
         "targetAudience": ["string"]
       }
       
    B. Type "timeline":
       "content": {
         "introText": "string intro",
         "chapters": [
           {
             "id": "string",
             "title": "chapter title",
             "timestampDisplay": "MM:SS",
             "timestampSeconds": number,
             "durationMinutes": number,
             "summary": "chapter summary",
             "keyConcepts": ["concept"],
             "badge": "string"
           }
         ]
       }
       Note: Match these to real video times/segments!
       
    C. Type "concept":
       "content": {
         "coreIdea": "string idea",
         "deepDive": "string narrative",
         "keyTakeaways": ["takeaway"],
         "diagram": { // optional but highly recommended!
           "type": "flow" | "architecture" | "sequence",
           "title": "string title",
           "description": "string description",
           "asciiArt": "ASCII diagram mapping the flow/concept",
           "caption": "string caption"
         },
         "callout": { // optional
           "type": "note" | "warning" | "tip",
           "text": "string text",
           "author": "string author"
         }
       }
       
    D. Type "process":
       "content": {
         "description": "string description",
         "steps": [
           {
             "stepNumber": number,
             "title": "step title",
             "description": "step description",
             "checkpoint": "what to verify",
             "warning": "common pitfall"
           }
         ]
       }
       
    F. Type "comparison":
       "content": {
         "context": "string comparison background",
         "columns": [
           { "key": "string", "label": "string", "highlight": boolean }
         ],
         "rows": [
           {
             "aspect": "string aspect",
             "values": { "col_key": "value" },
             "verdictWinnerKey": "col_key",
             "note": "string explanation"
           }
         ]
       }
       
    G. Type "insight":
       "content": {
         "introText": "string intro",
         "insights": [
           {
             "id": "string",
             "title": "string title",
             "text": "string text",
             "type": "rule" | "warning" | "heuristic" | "mental-model",
             "citation": "string (optional)"
           }
         ]
       }
       
    H. Type "quiz":
       "content": {
         "introText": "string intro",
         "questions": [
           {
             "id": "string",
             "question": "string question",
             "options": ["option 1", "option 2", "option 3", "option 4"],
             "correctOptionIndex": number (0-3),
             "explanation": "string explanation"
           }
         ]
       }
       
    I. Type "takeaways":
       "content": {
         "summary": "string summary",
         "checklist": [
           { "id": "string", "task": "string task", "description": "string" }
         ],
         "nextSteps": [
           { "title": "string", "description": "string" }
         ]
       }
       
    J. Type "provenance":
       "content": {
         "sourceUrl": "https://www.youtube.com/watch?v=${rawData.videoId}",
         "authorName": "${rawData.metadata.author.name}",
         "channelOrOrg": "${rawData.metadata.author.channelOrOrg || ''}",
         "license": "Standard YouTube License",
         "excerpts": [
           {
             "text": "direct quote or key segment summary",
             "timestampDisplay": "MM:SS",
             "timestampSeconds": number
           }
         ]
       }

Compile all information directly from the provided segments. Make sure to represent ALL core details, warnings, code examples, or diagrams discussed in the video.
Ensure the output is raw JSON, with no markdown code blocks (do NOT wrap in \`\`\`json). The output must be valid JSON parseable by JSON.parse().
`;

    const model = 'gemini-2.5-pro';
    console.log(`Generating structured pedagogy using ${model}...`);
    const chatResult = await ai.models.generateContent({
      model,
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }]
        }
      ],
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      }
    });

    const jsonText = chatResult.text;
    if (!jsonText) {
      throw new Error('Received empty response from Gemini');
    }

    const cleanJsonText = jsonText.trim().replace(/^```json/, '').replace(/```$/, '').trim();
    const knowledgeObj = JSON.parse(cleanJsonText);
    const slug = knowledgeObj.slug || `video-${videoId}`;

    const tempKoPath = path.join(tmpDir, `${slug}_ko.json`);
    fs.writeFileSync(tempKoPath, JSON.stringify(knowledgeObj, null, 2), 'utf-8');
    console.log(`\n✅ KnowledgeObject JSON saved to: ${tempKoPath}`);

    // ---------------------------------------------------------------------------
    // PHASE 3: Register KnowledgeObject programmatically
    // ---------------------------------------------------------------------------
    console.log(`\n==================================================`);
    console.log(`📝 PHASE 3: Registering KnowledgeObject to YouLearn live catalog...`);
    console.log(`==================================================\n`);

    const registerScript = path.join(process.cwd(), '.agent', 'skills', 'ag47-youlearn-skill', 'scripts', 'register_knowledge.ts');
    const registerCmd = `npx tsx "${registerScript}" "${tempKoPath}"`;
    console.log(`Executing: ${registerCmd}`);
    const registerOutput = execSync(registerCmd, { encoding: 'utf-8' });
    const registerResult = JSON.parse(registerOutput);

    if (registerResult.status !== 'SUCCESS') {
      throw new Error(registerResult.message || 'Registration failed');
    }

    console.log(`\n✅ KnowledgeObject registered successfully!`);
    console.log(`- Derived Library Entry: ${registerResult.entry.title}`);
    console.log(`- Compression: ${registerResult.entry.compressionRatioPercent}% saved`);

    // ---------------------------------------------------------------------------
    // PHASE 4: Run Tests & Verification Checks
    // ---------------------------------------------------------------------------
    console.log(`\n==================================================`);
    console.log(`🧪 PHASE 4: Running Verification Test Suite & Typecheck...`);
    console.log(`==================================================\n`);

    const testRunnerPath = path.join(process.cwd(), 'eco', 'youlearn', 'tests', 'test-runner.ts');
    const testCmd = `npx tsx "${testRunnerPath}"`;
    console.log(`Running tests: ${testCmd}`);
    const testOutput = execSync(testCmd, { encoding: 'utf-8' });
    console.log(testOutput);

    const typecheckCmd = 'npx tsc --noEmit';
    console.log(`Running Typecheck: ${typecheckCmd}`);
    execSync(typecheckCmd, { encoding: 'utf-8' });
    console.log('✅ TypeScript compilation: 0 errors!');

    // ---------------------------------------------------------------------------
    // PHASE 5: Print Processing Report
    // ---------------------------------------------------------------------------
    const origMin = knowledgeObj.learning.originalDurationMinutes;
    const estMin = knowledgeObj.learning.estimatedLearningMinutes;
    const compRatio = Math.round(((origMin - estMin) / origMin) * 100);

    console.log(`\n==================================================`);
    console.log(`✨ YOULEARN PROCESSING REPORT`);
    console.log(`==================================================`);
    console.log(`Title:            ${knowledgeObj.title}`);
    console.log(`Source Author:    ${knowledgeObj.source.author.name}`);
    console.log(`Source URL:       ${knowledgeObj.source.url}`);
    console.log(`Original Time:    ${origMin} min`);
    console.log(`YouLearn Time:    ${estMin} min`);
    console.log(`Compression:      ${compRatio}% faster`);
    console.log(`Sections Built:   ${knowledgeObj.sections.length} visual sections`);
    console.log(`Validation:       ✅ PASSED (Zod Schema)`);
    console.log(`Catalog Status:   ✅ REGISTERED (eco/youlearn/data/${slug}.ts)`);
    console.log(`Live Route:       /eco/youlearn/learn/${slug}`);
    console.log(`==================================================\n`);

  } catch (err: any) {
    console.error('\n❌ Ingestion Pipeline Error:', err.message);
    process.exit(1);
  }
}

runIngest();

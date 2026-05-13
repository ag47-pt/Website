import fs from 'fs';
import path from 'path';
import SkillsHero from './components/SkillsHero';
import SkillCard from './components/SkillCard';
import AlgorithmicPlayground from './components/AlgorithmicPlayground';
import DynamicHeader from '../../components/DynamicHeader';

interface Skill {
  id: string;
  name: string;
  description: string;
}

function getSkills(): Skill[] {
  const skillsDir = path.join(process.cwd(), '.agent', 'skills');
  if (!fs.existsSync(skillsDir)) return [];

  const folders = fs.readdirSync(skillsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const skills: Skill[] = [];

  for (const folder of folders) {
    const skillPath = path.join(skillsDir, folder, 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      const content = fs.readFileSync(skillPath, 'utf8');
      
      // Simple frontmatter parser using regex
      const match = content.match(/---\n([\s\S]*?)\n---/);
      let name = folder;
      let description = 'Sem descrição disponível. Esta skill precisa ter seu frontmatter configurado.';
      
      if (match && match[1]) {
        const frontmatter = match[1];
        const nameMatch = frontmatter.match(/name:\s*(.+)/);
        const descMatch = frontmatter.match(/description:\s*(.+)/);
        
        if (nameMatch) name = nameMatch[1].trim();
        if (descMatch) description = descMatch[1].trim();
      }

      skills.push({
        id: folder,
        name,
        description
      });
    }
  }

  // Sort skills alphabetically
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

export const metadata = {
  title: 'Agent Skills Hub | Agência 47 Labs',
  description: 'Diretório interativo de habilidades e inteligências artificiais do sistema Ag47.',
};

export default function AgentHubPage() {
  const skills = getSkills();

  return (
    <div className="min-h-screen text-white">
      <SkillsHero />
      
      <main className="container mx-auto px-6 pb-24 max-w-7xl">
        <section className="mb-32">
          <DynamicHeader 
            title="Skills Disponíveis"
            count={skills.length}
            countLabel="Ativas"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {skills.map(skill => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </section>

        <section id="playground" className="mb-24 scroll-mt-24">
          <AlgorithmicPlayground />
        </section>
      </main>
    </div>
  );
}

import fs from 'fs';
import path from 'path';
import AgentHero from './components/AgentHero';
import AgentCard from './components/AgentCard';
import DynamicHeader from '../components/DynamicHeader';

interface Agent {
  id: string;
  name: string;
  description: string;
  skills: string[];
}

function getAgents(): Agent[] {
  const agentsDir = path.join(process.cwd(), '.agent', 'agents');
  if (!fs.existsSync(agentsDir)) return [];

  const files = fs.readdirSync(agentsDir)
    .filter(file => file.endsWith('.md') && file !== 'README.md');

  const agents: Agent[] = [];

  for (const file of files) {
    const agentPath = path.join(agentsDir, file);
    const content = fs.readFileSync(agentPath, 'utf8');
    
    // Simple frontmatter parser
    const match = content.match(/---\n([\s\S]*?)\n---/);
    let name = file.replace('.md', '');
    let description = 'Especialista em arquitetura e desenvolvimento avançado.';
    let skills: string[] = [];
    
    if (match && match[1]) {
      const frontmatter = match[1];
      const nameMatch = frontmatter.match(/name:\s*['"]?([^'"\n]+)['"]?/);
      const descMatch = frontmatter.match(/description:\s*['"]?([^'"\n]+)['"]?/);
      
      const skillsSection = frontmatter.split('skills:')[1];
      if (skillsSection) {
        const lines = skillsSection.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('-')) {
            skills.push(trimmed.substring(1).trim().replace(/['"]/g, ''));
          } else if (trimmed !== '' && !trimmed.startsWith('#')) {
            // Se encontrar outra chave de YAML, para de ler
            if (trimmed.includes(':')) break;
          }
        }
      }
      
      if (nameMatch) name = nameMatch[1].trim();
      if (descMatch) description = descMatch[1].trim();
    }

    agents.push({
      id: file,
      name,
      description,
      skills
    });
  }

  return agents.sort((a, b) => a.name.localeCompare(b.name));
}

export const metadata = {
  title: 'Agent Hub | Agência 47 Labs',
  description: 'Diretório interativo de agentes de inteligência artificial da Ag47.',
};

export default function AgentsPage() {
  const agents = getAgents();

  return (
    <div className="min-h-screen text-white">
      <AgentHero />
      
      <main className="container mx-auto px-6 pb-24 max-w-7xl">
        <section className="mb-32">
          <DynamicHeader 
            title="Especialistas"
            count={agents.length}
            countLabel="Ativos"
            icon={<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {agents.map(agent => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

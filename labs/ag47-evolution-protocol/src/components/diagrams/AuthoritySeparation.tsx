import { Reveal } from "@/components/ui/Reveal";
import { authorityMatrix, capabilities, roles } from "@/data/roles";
import { cn } from "@/lib/utils";

/**
 * Matriz de separação de autoridade.
 *
 * Cada papel detém exatamente uma capacidade — a diagonal formada pelas marcas
 * é o argumento visual: não existe papel que proponha, execute e aprove.
 *
 * É uma `<table>` de verdade, com cabeçalhos em ambos os eixos, para que a
 * relação linha/coluna continue legível fora do contexto visual.
 */
export function AuthoritySeparation() {
  return (
    <Reveal className="overflow-x-auto rounded-xl border border-hairline bg-surface/40">
      <table className="w-full min-w-[640px] border-collapse text-left">
        <caption className="sr-only">
          Capacidade exclusiva de cada papel do protocolo
        </caption>
        <thead>
          <tr className="border-b border-hairline">
            <th
              scope="col"
              className="px-5 py-4 font-mono text-[10px] tracking-[0.18em] text-fg-faint uppercase"
            >
              Papel
            </th>
            {capabilities.map((capability) => (
              <th
                key={capability}
                scope="col"
                className="px-3 py-4 text-center font-mono text-[10px] leading-tight tracking-[0.14em] text-fg-faint uppercase"
              >
                {capability}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => {
            const owned = authorityMatrix[role.id];

            return (
              <tr key={role.id} className="border-b border-hairline last:border-b-0">
                <th
                  scope="row"
                  className="px-5 py-4 text-sm font-medium whitespace-nowrap text-fg"
                >
                  {role.name}
                </th>
                {capabilities.map((capability, index) => {
                  const has = index === owned;

                  return (
                    <td key={capability} className="px-3 py-4 text-center">
                      <span
                        className={cn(
                          "inline-flex size-6 items-center justify-center rounded-md",
                          has
                            ? "border border-accent-dim bg-accent/10 text-accent"
                            : "text-fg-faint",
                        )}
                      >
                        <span className="sr-only">
                          {has ? `${role.name} detém: ${capability}` : "não"}
                        </span>
                        <span aria-hidden className="text-sm leading-none">
                          {has ? "✓" : "–"}
                        </span>
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </Reveal>
  );
}

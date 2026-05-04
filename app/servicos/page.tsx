import { services } from "@/data/services";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nossos Serviços | AG47",
  description: "Soluções completas de tecnologia e marketing: Criação de Sites, WebApps, SaaS e Tráfego Pago com foco em ROI.",
};

export default function ServicesListPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold mb-4 text-center">Nossos Serviços</h1>
        <p className="text-white/60 text-center mb-16 max-w-2xl mx-auto">
          Estratégia, Design 3D e Tecnologia de ponta para impulsionar seu negócio em escala global.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link 
              key={service.slug} 
              href={`/servicos/${service.slug}`}
              className="group bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all hover:border-white/20"
            >
              <h2 className="text-2xl font-bold mb-4 group-hover:translate-x-1 transition-transform">
                {service.title}
              </h2>
              <p className="text-white/50 mb-6 line-clamp-3">
                {service.description}
              </p>
              <span className="text-sm font-mono uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
                Ver detalhes →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}

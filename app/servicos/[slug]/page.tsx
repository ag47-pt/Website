import { services } from "@/data/services";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const service = services.find((s) => s.slug === params.slug);
  
  if (!service) return {};

  return {
    title: service.title,
    description: service.description,
    openGraph: {
      title: `${service.title} | AG47`,
      description: service.description,
      type: "article",
    },
    keywords: [...service.features, "Agência 47", "ROI", "Portugal", "Brasil"],
  };
}

export default async function ServicePage(props: Props) {
  const params = await props.params;
  const service = services.find((s) => s.slug === params.slug);

  if (!service) {
    notFound();
  }

  // Schema Markup para o serviço e FAQ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.description,
    "provider": {
      "@type": "Organization",
      "name": "Agência 47"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Serviços de Marketing e Desenvolvimento",
      "itemListElement": service.features.map((feature, index) => ({
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": feature
        }
      }))
    }
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": service.faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      <main className="min-h-screen bg-black text-white p-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">
            {service.title}
          </h1>
          
          <p className="text-xl text-white/70 mb-12 leading-relaxed">
            {service.fullDescription}
          </p>

          <section className="grid md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-semibold mb-4 border-l-4 border-white pl-4">Diferenciais</h2>
              <ul className="space-y-3">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full" />
                    <span className="text-white/80">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-semibold mb-4">Foco em ROI</h2>
              <p className="text-white/70 italic">
                "{service.roiFocus}"
              </p>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Cases de Sucesso</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-8 text-center">
                <p className="text-white/40">Case em breve: Resultados reais para clientes reais.</p>
              </div>
              <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center p-8 text-center">
                <p className="text-white/40">Case em breve: Estratégia vencedora para o mercado de {service.slug.split('-')[0]}.</p>
              </div>
            </div>
          </section>

          <section className="mb-16">
            <h2 className="text-2xl font-semibold mb-8">Dúvidas Frequentes</h2>
            <div className="space-y-6">
              {service.faqs.map((faq) => (
                <div key={faq.question} className="border-b border-white/10 pb-6">
                  <h3 className="text-lg font-medium mb-2">{faq.question}</h3>
                  <p className="text-white/60">{faq.answer}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center mt-20">
            <button className="bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-white/90 transition-all">
              Solicitar Orçamento Grátis
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

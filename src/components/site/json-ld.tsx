import { site } from "@/lib/content";

const data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MedicalBusiness",
      "@id": `${site.url}/#business`,
      name: "Theosis Medical, LLC",
      url: site.url,
      email: site.email,
      telephone: "+1-765-487-0777",
      description: site.description,
      image: `${site.url}/images/logo.jpg`,
      founder: { "@id": `${site.url}/#nick` },
      areaServed: ["Illinois", "Wisconsin", "Michigan", "Indiana"],
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#nick`,
      name: "Nick Holwey",
      honorificSuffix: "PA-C",
      jobTitle: "Emergency Medicine Physician Assistant",
      description: site.description,
      image: `${site.url}/images/nick.jpg`,
      url: `${site.url}/#about`,
      worksFor: { "@id": `${site.url}/#business` },
      alumniOf: [
        { "@type": "CollegeOrUniversity", name: "Wichita State University" },
        { "@type": "CollegeOrUniversity", name: "University of Illinois" },
      ],
    },
    {
      "@type": "WebSite",
      name: site.name,
      url: site.url,
      description: site.description,
      publisher: { "@id": `${site.url}/#business` },
    },
  ],
};

export function JsonLd() {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}

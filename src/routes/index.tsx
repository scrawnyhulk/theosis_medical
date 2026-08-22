import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Mail, Phone } from "lucide-react";
import { BrandLockup } from "@/components/brand-lockup";
import { InquiryForm } from "@/components/inquiry-form";
import { SiteHeader } from "@/components/site-header";
import { SuggestionForm } from "@/components/suggestion-form";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Home });

const PHONE_DISPLAY = "765.487.0777";
const PHONE_HREF = "tel:+17654870777";
const EMAIL = "nick@theosismedical.com";

const PLANS = [
  {
    num: "01",
    title: "Lifestyle & Wellness",
    body: "Evidence-based lifestyle consultations drawing on my background in nutrition and medicine, with practical strategies designed to help you get leaner, get stronger, improve your health, and build habits you can actually maintain.",
  },
  {
    num: "02",
    title: "Labs + Your Plan",
    body: "Targeted laboratory testing to better understand your current health, followed by an individualized, easy-to-follow plan. No unnecessary complexity—just actionable priorities built around the minimum effective dose and the changes most likely to move the needle.",
  },
  {
    num: "03",
    title: "Urgent Care by Telemedicine",
    body: "Convenient virtual evaluation for appropriate acute medical concerns—the sore throat, rash, minor illness, or other problem that needs medical attention but may not need an emergency department.",
  },
];

const CREDENTIALS: { title: string; items: string[]; wide?: boolean }[] = [
  {
    title: "Education",
    items: [
      "Master of Physician Assistant Studies (MPAS) — Wichita State University",
      "B.S., Food Science & Human Nutrition — University of Illinois Urbana-Champaign",
    ],
  },
  {
    title: "Credentials & Certifications",
    items: [
      "NCCPA-Certified Physician Assistant (PA-C)",
      "Certificate of Added Qualifications — Emergency Medicine (CAQ-EM)",
      "Advanced Cardiovascular Life Support (ACLS)",
      "Pediatric Advanced Life Support (PALS)",
      "Advanced Trauma Life Support (ATLS)",
      "Neonatal Resuscitation Program (NRP)",
      "Basic Life Support (BLS)",
      "Point-of-Care Ultrasound Credentialed",
      "DEA Registered",
    ],
  },
  {
    title: "State Licensure",
    items: ["Illinois", "Wisconsin", "Michigan", "Indiana"],
  },
  {
    title: "Clinical Experience",
    items: [
      "Emergency Medicine",
      "Level I Trauma & High-Acuity Emergency Care",
      "Rural & Community Emergency Medicine",
      "Urgent Care",
      "Telemedicine",
      "Hospital & Observation Medicine",
      "Prehospital Emergency Medicine",
    ],
  },
  {
    title: "Procedural Skills",
    wide: true,
    items: [
      "Point-of-Care Ultrasound (POCUS)",
      "Endotracheal Intubation & Airway Management",
      "Central Venous Catheter Placement",
      "Procedural Sedation",
      "Fracture & Joint Reduction",
      "Laceration Repair",
      "Incision & Drainage",
      "Lumbar Puncture",
      "Arthrocentesis",
      "Paracentesis",
      "Foreign Body Removal",
      "Local & Regional Anesthesia",
      "Slit-Lamp Examination",
      "Ultrasound-Guided Procedures",
      "Trauma Stabilization & Resuscitation",
    ],
  },
];

function Home() {
  return (
    <div id="top" className="min-h-svh bg-bg text-fg">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Hero />
        <About />
        <WhyTheosis />
        <Contact />
        <Plans />
      </main>
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative -mt-16 min-h-svh">
      <picture>
        <source media="(min-width: 768px)" srcSet="/images/logo.jpg" />
        <img
          src="/images/logo-portrait.jpg"
          alt="Theosis Medical emblem: a silver shield bearing the Star of Life, a cross, and the serpent of healing."
          className="no-outline absolute inset-0 size-full object-cover object-center"
        />
      </picture>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-8 pt-24 sm:px-8">
        <div className="stagger-in mx-auto max-w-6xl text-ink-fg">
          <p className="text-xs font-medium tracking-widest text-ink-muted uppercase">
            Nick Holwey, PA-C · Emergency medicine
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button asChild variant="onInk" size="lg">
              <a href="#contact">
                How to contact
                <ArrowRight />
              </a>
            </Button>
            <Button asChild variant="onInkOutline" size="lg">
              <a href="#about">About me</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <div>
          <div className="mb-8 overflow-hidden rounded-xl lg:float-left lg:mb-6 lg:mr-12 lg:w-5/12">
            <img
              src="/images/nick.jpg"
              alt="Nick Holwey, PA-C, physician assistant and founder of Theosis Medical."
              className="aspect-4/5 w-full object-cover object-center"
            />
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-wide sm:text-5xl">
            About Me
          </h1>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
            <p>
              My name is Nick Holwey, and I am an Emergency Medicine Physician
              Assistant with more than 13 years of clinical experience and the
              founder of Theosis Medical. I earned my Master of
              Physician Assistant Studies from Wichita State University after
              completing my undergraduate degree in Food Science and Human
              Nutrition at the University of Illinois.
            </p>
            <p>
              Emergency medicine has been the foundation of my career, with
              experience spanning Level I trauma centers and high-acuity
              emergency care to community and rural emergency departments, as
              well as urgent care, telemedicine, hospital medicine, and
              prehospital emergency care. I am NCCPA-certified, hold the
              Certificate of Added Qualifications in Emergency Medicine
              (CAQ-EM), and maintain licensure across multiple states.
            </p>
            <p>
              Today, I practice primarily as an independent contractor in
              emergency medicine through Theosis Medical, providing care in
              rural and community emergency departments where adaptability,
              sound clinical judgment, and the ability to work effectively with
              limited resources are especially important.
            </p>
            <p>
              Beyond emergency medicine, I have maintained a longstanding
              interest in lifestyle medicine, nutritional biochemistry, and
              exercise physiology. My degree in nutrition has continued to
              influence the way I think about health and disease, and I
              regularly follow the evolving literature in these areas with a
              particular interest in how evidence-based nutrition, exercise, and
              lifestyle interventions can both improve but also prevent
              long-term health problems and disease. I incorporate these
              principles into my practice when possible, but time is typically
              limited in my emergency medicine, and so my hope is to eventually
              develop a more dedicated space within Theosis Medical to help
              patients translate that evidence into practical, sustainable
              changes that fit real life.
            </p>
            <p>
              While my experience and training shape me as a clinician, my
              faith and family shape who I am as a person. As a husband and
              father, I'm continually reminded that every patient is
              someone's loved one. My faith likewise calls me toward
              service, humility, compassion, and continual growth—principles
              that influence both the way I practice medicine and the kind of
              company I want Theosis Medical to be.
            </p>
            <p>
              After more than a decade in emergency medicine, my approach
              remains straightforward: practice excellent medicine, be
              dependable when people need you, and treat every patient with the
              dignity and compassion I would want shown to my own family.
            </p>
          </div>
          <div className="clear-both" />
        </div>

        <aside className="mt-12 rounded-xl bg-surface p-6 shadow-border sm:p-8 lg:mt-16">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            At a glance
          </p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {CREDENTIALS.map((group) => (
              <div
                key={group.title}
                className={group.wide ? "sm:col-span-2" : undefined}
              >
                <h2 className="font-display text-lg font-semibold tracking-wide text-fg">
                  {group.title}
                </h2>
                <ul
                  className={
                    group.wide
                      ? "mt-2 grid gap-x-8 gap-y-1 text-sm leading-relaxed text-muted sm:grid-cols-2"
                      : "mt-2 space-y-1 text-sm leading-relaxed text-muted"
                  }
                >
                  {group.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span
                        aria-hidden="true"
                        className="mt-2 size-1 shrink-0 rounded-full bg-accent"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

function WhyTheosis() {
  return (
    <section id="why" className="scroll-mt-20 border-y border-border bg-surface">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <h2 className="font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          Why "Theosis Medical"?
        </h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
          <p>
            I believe that healing extends beyond treating symptoms — it
            involves recognizing the full dignity of every person who walks
            through the door. At Theosis Medical, this conviction shapes how I
            approach every patient encounter.
          </p>
          <p>
            The name Theosis draws from an ancient Eastern Orthodox Christian
            concept describing the lifelong process of personal growth and
            transformation — our humanity working in perfect cooperation with
            divine grace to become more fully who we were created to be. This
            comes through humility, compassion, wisdom, and service to others.
            At its heart, it reflects the idea of participating in something
            greater than ourselves: a continual journey toward perfection,
            integrity, and deeper connection with those around us, and
            ultimately God.
          </p>
          <p>
            While this understanding is rooted in my faith, it is not something
            I expect of my patients. People come from many different
            backgrounds, beliefs, and life experiences, and that diversity is
            respected here. The principles behind the name are standards I set
            for myself as a clinician — not requirements for those I serve.
            Every individual who entrusts me with their care will receive the
            same high-quality treatment, compassion, and respect, regardless of
            background.
          </p>
          <p>
            In the fast-paced world of emergency and hospital medicine, I often
            meet people on some of their hardest days — amid pain, fear,
            uncertainty, or loss. I strive to meet those moments with patience,
            attentiveness, and genuine human connection. I view each patient
            not merely as a diagnosis or a chart, but as a person of inherent
            worth deserving of clear communication, thoughtful care, and
            dignity.
          </p>
          <p>
            As an independent locum tenens practice, Theosis Medical allows me
            to go where the need is greatest, providing experienced coverage to
            hospitals and communities across Wisconsin and Illinois. I approach
            this work as both a professional responsibility and a personal
            calling: to deliver excellent medicine while continuing to grow as
            a more compassionate, reliable, and effective clinician.
          </p>
          <p>
            My goal is simple: that every patient leaves my care not only with
            better health, but also with the quiet assurance that they were
            truly seen, heard, and treated with kindness.
          </p>
        </div>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section id="plans" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">
          Future plans
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          Better Health. Made Practical.
        </h2>
        <div className="mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
          <p>
            Although Emergency Medicine is the bread and butter of Theosis
            Medical, my long-term vision extends beyond treating illness when it
            happens. I want to help people prevent the conditions that land them
            in the emergency department years later. My passion is to help
            people become{" "}
            <span className="text-fg">
              healthier, stronger, and more resilient but in a way that fits
              their life.
            </span>
          </p>
          <p>
            With a background in Food Science and Human Nutrition in addition to
            more than 13 years of clinical experience, my goal is to develop a
            practical approach to lifestyle medicine that cuts through the
            noise. The world of nutrition and exercise has been overcomplicated
            by Men's Health and lifestyle magazines making it impossible to
            know what is truly beneficial.
          </p>
          <p>
            Life is busy. Diets are difficult to sustain. Exercise can be
            time-consuming and expensive. And most people don't need
            another complicated program telling them to change everything at
            once.
          </p>
          <p>
            Instead, I want to focus on the minimum effective dose: identifying
            the small number of evidence-based changes that can produce the
            greatest impact. Think of it as the 80/20 approach to better
            health—focus on the 20% that delivers 80% of the results.
          </p>
          <p>
            Through individualized consultations and targeted laboratory
            testing, the goal will be to understand where you are today and
            build a realistic plan around your health, your goals, and your
            life. The approach is one I've applied in my own life: make
            the right things easier to do, eliminate unnecessary complexity, and
            focus effort where it matters most.
          </p>
          <p>
            Alongside preventive and lifestyle-focused care, I also plan to
            expand Theosis Medical to provide telemedicine for appropriate acute
            and urgent-care concerns—giving patients a convenient option when
            something needs attention without necessarily requiring a trip to an
            urgent care or emergency department.
          </p>
        </div>
        <Button asChild className="mt-8" size="lg">
          <a href="#suggest">
            Share a Suggestion
            <ArrowRight />
          </a>
        </Button>

        <h3 className="mt-16 font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          What's Ahead
        </h3>
        <div className="mt-8 grid gap-px bg-border-strong sm:grid-cols-3">
          {PLANS.map((item) => (
            <article
              key={item.num}
              className="bg-surface px-6 py-8 sm:px-8 sm:py-10"
            >
              <p className="font-display text-3xl font-semibold text-accent">
                {item.num}
              </p>
              <h3 className="mt-4 font-display text-3xl font-semibold tracking-wide uppercase">
                {item.title}
              </h3>
              <p className="mt-3 leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>

        <div
          id="suggest"
          className="mt-16 grid scroll-mt-20 gap-10 lg:grid-cols-2 lg:gap-16"
        >
          <div>
            <h3 className="font-display text-4xl font-semibold tracking-wide sm:text-5xl">
              Help Shape What's Next
            </h3>
            <div className="mt-5 space-y-5 text-lg leading-relaxed text-muted">
              <p>
                Theosis Medical is still growing, and I want its future services
                to solve real problems for real people.
              </p>
              <p>
                Is there a service you'd find useful? Something about
                healthcare, nutrition, fitness, or accessing medical care that
                feels unnecessarily difficult?
              </p>
              <p>I'd like to hear it.</p>
            </div>
          </div>
          <SuggestionForm />
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 bg-ink text-ink-fg">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-24">
        <div>
          <p className="text-xs font-medium tracking-widest text-ink-muted uppercase">
            How to contact
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-wide uppercase sm:text-5xl">
            Call, write, or send the days you need covered.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
            Facility, setting, dates, and anything that will matter in
            credentialing. A short note is enough to start.
          </p>

          <ul className="mt-8 space-y-3">
            <li>
              <a
                href={PHONE_HREF}
                className="inline-flex min-h-11 items-center gap-3 text-lg text-ink-fg transition-colors hover:text-accent"
              >
                <Phone className="size-5 shrink-0 text-accent" />
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex min-h-11 items-center gap-3 text-lg text-ink-fg transition-colors hover:text-accent"
              >
                <Mail className="size-5 shrink-0 text-accent" />
                {EMAIL}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm text-ink-muted">
            Theosis Medical, LLC · Illinois-based · multi-state licensed
          </p>
        </div>
        <InquiryForm />
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-fg">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-border px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <BrandLockup />
          <p className="text-sm text-ink-muted">
            Nick Holwey, PA-C · Illinois-based · multi-state licensed
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-ink-muted md:items-end">
          <a href={PHONE_HREF} className="hover:text-ink-fg">
            {PHONE_DISPLAY}
          </a>
          <a href={`mailto:${EMAIL}`} className="hover:text-ink-fg">
            {EMAIL}
          </a>
          <p>© {new Date().getFullYear()} Theosis Medical, LLC</p>
        </div>
      </div>
    </footer>
  );
}

import Image from 'next/image'
import ContactForm from '@/components/contact-form'
import { contactConfig } from '@/lib/contact-data'

const CONTACT_IMAGE_WIDTH = 1448
const CONTACT_IMAGE_HEIGHT = 1086

export default function ContactSupportSection() {
  return (
    <section
      className="paper-texture relative w-full bg-brand-mist lg:bg-brand-mist"
      aria-labelledby="contact-support-heading"
    >
      <div className="relative w-full">
        <Image
          src={contactConfig.visualImagePath}
          alt=""
          width={CONTACT_IMAGE_WIDTH}
          height={CONTACT_IMAGE_HEIGHT}
          className="hidden h-auto w-full lg:block"
          sizes="(max-width: 1024px) 0px, 100vw"
        />

        <div className="relative z-10 flex items-start px-4 py-10 sm:px-6 sm:py-12 lg:absolute lg:inset-0 lg:items-center lg:px-8 lg:py-16">
          <div className="mx-auto grid w-full max-w-6xl lg:grid-cols-2">
            <div className="hidden lg:block" aria-hidden />

            <div className="flex flex-col justify-center lg:pl-8 xl:pl-12">
              <h1
                id="contact-support-heading"
                className="scroll-mt-24 font-display text-4xl font-medium tracking-wide text-brand-void sm:scroll-mt-28 sm:text-5xl lg:text-6xl"
              >
                Need support?
              </h1>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-earth sm:text-base">
                Contact us if you have any questions or concerns.
              </p>
              <div className="mt-7 sm:mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

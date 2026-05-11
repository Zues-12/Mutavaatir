import { BookOpen, Package, Bookmark, Users } from 'lucide-react'

const features = [
  {
    icon: BookOpen,
    title: 'HANDPICKED BOOKS',
    description: 'Thoughtfully chosen reads that inspire, educate and elevate.',
  },
  {
    icon: Package,
    title: 'MONTHLY DELIVERY',
    description: 'A carefully packed surprise, delivered to your doorstep every month.',
  },
  {
    icon: Bookmark,
    title: 'EXCLUSIVE EXTRAS',
    description: 'Receive limited edition bookmarks and other curated items.',
  },
  {
    icon: Users,
    title: 'TRUSTED BY READERS',
    description: 'Building a community of readers who value quality and authenticity.',
  },
]

export default function Features() {
  return (
    <section className="bg-amber-100 py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isNotLast = index !== features.length - 1
            
            return (
              <div
                key={index}
                className={`flex flex-col items-start space-y-4 pb-8 md:pb-0 ${
                  isNotLast ? 'md:border-r md:border-amber-800/30 md:pr-8 lg:pr-6' : ''
                }`}
              >
                {/* Icon Container */}
                <div className="w-20 h-20 bg-amber-900 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                  <Icon size={32} className="text-amber-100" strokeWidth={1.5} />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h3
                    className="text-sm font-bold text-stone-900 tracking-wider leading-tight"
                    style={{ fontFamily: 'Oswald, sans-serif' }}
                  >
                    {feature.title}
                  </h3>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

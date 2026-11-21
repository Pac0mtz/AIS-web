import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router'
import { areaMedia } from '../areaMedia'

type CityLinkProps = {
  city: { slug: string; name: string; state: string; path: string }
}

export function CityLink({ city }: CityLinkProps) {
  const photo = areaMedia[city.slug]
  return (
    <Link to={city.path} className="city-link" aria-label={`${city.name}, ${city.state} services`}>
      <span className="city-link-photo">
        <img src={photo.src} alt="" width={160} height={120} loading="lazy" decoding="async" />
      </span>
      <span className="city-link-copy"><strong>{city.name}</strong><small>{city.state}</small></span>
      <span className="city-link-action" aria-hidden="true"><ChevronRight size={18} /></span>
    </Link>
  )
}

import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import type { Service } from '../data'
import { BrandIcon } from './BrandIcon'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link to={service.path} className="service-row" key={service.path}>
      <span className="service-number">{service.number}</span>
      <div className="service-row-title"><h3>{service.name}</h3><span>{service.eyebrow}</span></div>
      <p>{service.intro}</p>
      <div className="service-thumb"><img src={service.image} alt="" loading="lazy" decoding="async" /><span className="brand-icon-badge service-card-icon"><BrandIcon name={service.slug} /></span></div>
      <span className="round-arrow"><ArrowUpRight aria-hidden="true" /></span>
    </Link>
  )
}

import { Link } from 'react-router'
import { ArrowUpRight } from 'lucide-react'
import type { Service } from '../data'

export function ServiceCard({ service }: { service: Service }) {
  return (
    <Link to={service.path} className="service-row" key={service.path}>
      <span className="service-number">{service.number}</span>
      <div className="service-row-title"><h3>{service.name}</h3><span>{service.eyebrow}</span></div>
      <p>{service.intro}</p>
      <div className="service-thumb"><img src={service.image} alt="" loading="lazy" decoding="async" /></div>
      <span className="round-arrow"><ArrowUpRight aria-hidden="true" /></span>
    </Link>
  )
}

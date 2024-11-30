import { SVGProps } from 'react'

interface MinusProps extends SVGProps<SVGSVGElement> {
  strokeColor?: string
}

export const Minus = ({ strokeColor = 'white', ...props }: MinusProps) => (
  <svg
    {...props}
    width={props.width || '40'}
    height={props.height || '40'}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 12H16"
      stroke={strokeColor}
      stroke-width="1.5"
      stroke-linecap="round"
    />
  </svg>
)
